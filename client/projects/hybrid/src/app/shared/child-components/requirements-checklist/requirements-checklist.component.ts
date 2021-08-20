import { Component } from '@angular/core';
import { formProvider } from '~web/forms';
import { RequirementsChecklistComponent as WebRequirementsChecklistComponent } from '~web/shared/child-components/requirements-checklist/requirements-checklist.component';

@Component({
  selector: 'foodweb-hybrid-requirements-checklist',
  templateUrl: './requirements-checklist.component.html',
  styleUrls: ['./requirements-checklist.component.scss'],
  providers: formProvider(RequirementsChecklistComponent)
})
export class RequirementsChecklistComponent extends WebRequirementsChecklistComponent {}
