TODOs:
1. Update the logic in `server.js` to update `publishers.json` as well when create / update a publisher [DONE]
2. Create Publisher Form: [DONE]
    2.0. Update the model with all the fields, including optional literals.
    2.1. We can start with 'isEditing' flag as `true` by default when opening this page.
    2.1. common fields
    2.2. support `pages` list
    2.2. optional fields
    2.3. add custom field
    2.7. Save Button
    2.8. Save Confirmation Dialog
    2.9. Add validation logic on save button click
    2.10. when done, navigate back to home page & re-fetch the data.

3. Update the View / Update Publisher form with all the fields [DONE]
    3.1. When Open existing publisher - Fetch the publisher record when open the page
    3.2. Start with only 'view mode' (when open the page by clicking 'add publisher')
    3.3. then add 'Edit' button
    3.4. When in 'Edit' mode, change the fields to inputs.
    3.5 the save should be identical to 'create publisher'.
    2.10 The save button Should be disabled when no change

4. Publishers List Page - Search: [DONE]
    4.1. Basic Search field - UI only
    4.2. When Search value changes - call API again with search param


5. Requirements:
    5.1. Move the UI the 'public' folder.
    5.2. Documentations.
    5.3. Serious Code Review and Refactor.
    5.4. General CSS Improvment for all Pages. [done]
    5.5. Check the Port things

6. Tests: [DONE]
    - UT
    - E2E

7. Bonuses:
    7.1. Show diff as part of the save confirmation dialog Dialog. [DONE]
    7.2. In the 'View Publisher' mode screen, add the ability to download JSON.[DONE]
    7.3. Publisher Audit Log [DONE]
    7.4. Add Pagination [DONE]
    7.5. Return to top of page when fields are not filled in [DONE]
    7.6. Support Light / Dark modes [DONE]


