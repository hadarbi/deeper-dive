import { useRoute } from "../state/router.js";
import { publisherService } from "../services/publisherService.js";
import { renderPublisherForm } from "../ui/publisherForm/publisherForm.js";
import { renderPublisherView } from "../ui/publisherView/publisherView.js";
import { renderBreadcrumbs } from "../ui/breadcrumbs/breadcrumbs.js";
import { getState } from "../state/store.js";


export async function renderPublisherPage(root: HTMLElement) {
    const { isInCreateOrEditMode } = getState();
    const { params } = useRoute();
    const isInNewPublisherMode = !params.publisherId;

    const publisher = params.publisherId
        ? await publisherService.getById(params.publisherId)
        : null;

    let hasUnsavedChangesCheck: (() => boolean) | undefined;
    let pageConent;

    if (isInCreateOrEditMode) {
        const formResult = renderPublisherForm(publisher);
        hasUnsavedChangesCheck = formResult.hasUnsavedChanges;
        pageConent = formResult.wrapper;
    } else {
        pageConent = renderPublisherView(publisher);
    }

    const breadcrumbs = renderBreadcrumbs(
        publisher,
        isInNewPublisherMode,
        hasUnsavedChangesCheck,
    );

    root.append(breadcrumbs);
    root.append(pageConent);

}
