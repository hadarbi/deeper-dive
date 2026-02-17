import { Publisher } from "../../../types/publisher.js";
import { createSection, createSectionHeader, createFormGrid, createFormField, createTextInput } from "./common.js";

export type DashboardsInputs = {
    pubDashInput: HTMLInputElement;
    monDashInput: HTMLInputElement;
    qaDashInput: HTMLInputElement;
};

/**
 * Renders the "Dashboard URLs" section with dashboard links
 */
export function renderDashboards(publisher: Publisher | null): { section: HTMLElement; inputs: DashboardsInputs } {
    const pubDashInput = createTextInput(publisher?.publisherDashboard ?? "", "Publisher dashboard URL");
    const monDashInput = createTextInput(publisher?.monitorDashboard ?? "", "Monitor dashboard URL");
    const qaDashInput = createTextInput(publisher?.qaStatusDashboard ?? "", "QA status dashboard URL");

    const section = createSection();
    const header = createSectionHeader("🔗", "Dashboard URLs", "Links to monitoring and analytics dashboards");
    const grid = createFormGrid();
    const pubDashField = createFormField("Publisher Dashboard", pubDashInput);
    const monDashField = createFormField("Monitor Dashboard", monDashInput);
    const qaDashField = createFormField("QA Status Dashboard", qaDashInput);

    grid.append(pubDashField, monDashField, qaDashField);
    section.append(header, grid);
    return { section, inputs: { pubDashInput, monDashInput, qaDashInput } };
}
