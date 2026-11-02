import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Toast, ToastService } from 'ashen-ui/toast';
import { Button } from 'ashen-ui/button';
import { DocExample } from '../../../shared/doc-example/doc-example';
import { DocApi } from '../../../shared/doc-api/doc-api';

@Component({
  selector: 'app-toast-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'doc-page' },
  imports: [Toast, Button, DocExample, DocApi],
  templateUrl: './toast-page.html',
  styleUrl: './toast-page.scss',
})
export class ToastPage {
  protected readonly toast = inject(ToastService);

  protected showInfo(): void {
    this.toast.info('File uploaded', { detail: 'document.pdf has been saved.' });
  }

  protected showSuccess(): void {
    this.toast.success('Changes saved', { detail: 'Your settings have been updated.' });
  }

  protected showWarn(): void {
    this.toast.warn('Storage almost full', { detail: 'You have used 90% of your quota.' });
  }

  protected showError(): void {
    this.toast.error('Upload failed', { detail: 'The server returned a 500 error.' });
  }

  protected showRetryStack(): void {
    for (let attempt = 1; attempt <= 3; attempt++) {
      this.toast.show({ severity: 'error', summary: 'Save failed', sticky: true });
    }
  }

  protected showRetrySuppressed(): void {
    for (let attempt = 1; attempt <= 3; attempt++) {
      this.toast.show({
        severity: 'warning',
        summary: 'Save failed, retrying',
        sticky: true,
        preventDuplicates: true,
      });
    }
  }

  protected showRetryKeyed(): void {
    // The detail differs every time, so only a shared key collapses these.
    for (let attempt = 1; attempt <= 3; attempt++) {
      this.toast.show({
        severity: 'info',
        summary: 'Uploading',
        detail: `attempt ${attempt}`,
        sticky: true,
        key: 'upload',
        preventDuplicates: true,
      });
    }
  }

  protected showSticky(): void {
    this.toast.show({
      severity: 'info',
      summary: 'Sticky toast',
      detail: 'This toast will not auto-dismiss. Close it manually.',
      sticky: true,
    });
  }

  protected showNoClose(): void {
    this.toast.show({
      severity: 'success',
      summary: 'No close button',
      detail: 'Dismisses automatically after 3 s.',
      closable: false,
    });
  }

  protected clearAll(): void {
    this.toast.dismiss();
  }

  protected readonly codeService = `import { ToastService } from 'ashen-ui/toast';

@Component({ … })
export class MyComponent {
  private toast = inject(ToastService);

  save() {
    this.toast.success('Saved!');
  }
}`;
}
