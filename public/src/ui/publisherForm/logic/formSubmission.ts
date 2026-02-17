import { Publisher } from "../../../types/publisher.js";
import { publisherService } from "../../../services/publisherService.js";
import { showConfirmDialog, showConfirmDialogWithChanges } from "../../modal.js";
import { fetchPublishers } from "../../../handlers/handleFetchPublishers.js";
import { setState } from "../../../state/store.js";
import {
    runInlineValidation,
    clearFormErrors,
    displayValidationErrors
} from "./validation.js";
import { buildPayloadFromForm } from "./payloadBuilder.js";
import { generateDiff, formatChangesForDisplay } from "./diffGenerator.js";
import { BasicInfoInputs } from "../sections/renderBasicInfo.js";
import { PagesInputs } from "../sections/renderPages.js";
import { DashboardsInputs } from "../sections/renderDashboards.js";
import { OptionalInputs } from "../sections/renderOptionalSettings.js";
import { navigate, RouteKey } from "../../../state/router.js";

/**
 * Handles form submission - validates and saves publisher data
 */
export async function handleFormSubmit(
    form: HTMLFormElement,
    formInputs: BasicInfoInputs & PagesInputs & DashboardsInputs & OptionalInputs,
    publisher: Publisher | null,
): Promise<void> {
    const payload = buildPayloadFromForm(formInputs, publisher);

    // Client-side inline validation
    clearFormErrors(form);
    const inlineErrors = runInlineValidation(payload);

    if (Object.keys(inlineErrors).length > 0) {
        displayValidationErrors(form, inlineErrors, formInputs);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
    }

    if (publisher) {
        const changes = generateDiff(publisher, payload);
        const changesList = formatChangesForDisplay(changes);

        const confirmed = await showConfirmDialogWithChanges(
            "Update Publisher",
            changes.length > 0
                ? "Review your changes before saving:"
                : "No changes detected. Save anyway?",
            "⚠️",
            changesList
        );
        if (!confirmed) return;
        await publisherService.update(publisher.publisherId, payload);
        setState({ isInCreateOrEditMode: false });
        await fetchPublishers();
    } else {
        const confirmed = await showConfirmDialog(
            "Save Publisher",
            "Are you sure you want to save?",
            "💭"
        );
        if (!confirmed) return;
        await publisherService.create(payload);
        await fetchPublishers();
        setState({ isInCreateOrEditMode: false });
        navigate(RouteKey.PUBLISHERS);
    }
}
