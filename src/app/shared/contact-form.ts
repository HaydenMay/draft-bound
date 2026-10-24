import {Component, signal} from '@angular/core';
import {FormsModule, NgForm} from '@angular/forms';
import {CONTACT_FORM_CONFIG} from '../data/contact-form-config';

const CATEGORIES = [
  {value: 'bug-report', label: 'Bug Report', detail: 'Something isn’t working as expected.'},
  {value: 'feature-suggestion', label: 'Feature Suggestion', detail: 'Have an idea that could make Draftbound better?'},
  {value: 'gameplay-feedback', label: 'Gameplay Feedback', detail: 'Thoughts on balance, mechanics, or the overall experience.'},
  {value: 'technical-save-issue', label: 'Technical / Save Issue', detail: 'Trouble with saved progress, importing, exporting, or performance.'},
  {value: 'privacy-rights-concern', label: 'Privacy / Rights Concern', detail: 'Questions about personal information, privacy, or intellectual-property rights.'},
  {value: 'general-inquiry', label: 'General Inquiry', detail: 'Anything else you’d like to discuss.'},
] as const;

type ContactState = 'idle' | 'sending' | 'sent' | 'error';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    @if (!enabled) {
      <p class="contact-status" role="status">The contact form isn’t available yet. Submissions are disabled until message delivery and privacy details are set up.</p>
    } @else {
      <form class="contact-form" #form="ngForm" (ngSubmit)="submit(form)">
        <label for="contact-category">What can we help you with? <span aria-hidden="true">*</span></label>
        <select id="contact-category" name="category" required [(ngModel)]="fields.category">
          <option value="" disabled>Select a category</option>
          @for (category of categories; track category.value) {
            <option [value]="category.value">{{ category.label }}</option>
          }
        </select>
        @if (categoryDetail) { <p class="contact-field-note" aria-live="polite">{{ categoryDetail }}</p> }

        <label for="contact-name">Your Name <span class="contact-optional">(Optional)</span></label>
        <input id="contact-name" name="name" autocomplete="name" maxlength="100" [(ngModel)]="fields.name">

        <label for="contact-email">Email Address <span aria-hidden="true">*</span></label>
        <input id="contact-email" name="email" type="email" autocomplete="email" maxlength="254" required [(ngModel)]="fields.email">
        <p class="contact-field-note">We’ll only use your email to communicate with you about your message.</p>

        <label for="contact-subject">Subject <span aria-hidden="true">*</span></label>
        <input id="contact-subject" name="subject" maxlength="160" required [(ngModel)]="fields.subject">

        <label for="contact-message">Message <span aria-hidden="true">*</span></label>
        <textarea id="contact-message" name="message" rows="7" maxlength="10000" required [(ngModel)]="fields.message"></textarea>
        <p class="contact-field-note">For bug reports, include what happened and how to reproduce it.</p>

        <label for="contact-device">Browser / Device <span class="contact-optional">(Optional)</span></label>
        <input id="contact-device" name="browserDevice" maxlength="160" placeholder="Example: Chrome on Windows, Safari on iPhone" [(ngModel)]="fields.browserDevice">

        <div class="contact-honeypot" aria-hidden="true">
          <label for="contact-website">Leave this field empty</label>
          <input id="contact-website" name="website" tabindex="-1" autocomplete="off" [(ngModel)]="fields.website">
        </div>

        <p class="contact-field-note">Fields marked with * are required.</p>
        @if (state() === 'sent') {
          <p class="contact-status" role="status">Your message was sent. Thanks for getting in touch.</p>
        } @else if (state() === 'error') {
          <p class="contact-error" role="alert">Your message wasn’t sent. Please try again later.</p>
        }
        <button class="button primary contact-submit" type="submit" [disabled]="state() === 'sending'">
          {{ state() === 'sending' ? 'Sending…' : 'Send Message' }}
        </button>
      </form>
    }
  `,
  styleUrl: './contact-form.css',
})
export class ContactForm {
  readonly categories = CATEGORIES;
  readonly enabled = CONTACT_FORM_CONFIG.submissionsEnabled && Boolean(CONTACT_FORM_CONFIG.endpoint);
  readonly state = signal<ContactState>('idle');
  get categoryDetail(): string {
    return this.categories.find(category => category.value === this.fields.category)?.detail ?? '';
  }
  readonly fields = {
    category: '',
    name: '',
    email: '',
    subject: '',
    message: '',
    browserDevice: '',
    website: '',
  };

  async submit(form: NgForm): Promise<void> {
    if (!this.enabled || this.state() === 'sending' || form.invalid) return;
    if (this.fields.website.trim()) {
      this.state.set('error');
      return;
    }

    this.state.set('sending');
    try {
      const response = await fetch(CONTACT_FORM_CONFIG.endpoint, {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
        body: JSON.stringify({
          category: this.fields.category,
          name: this.fields.name.trim(),
          email: this.fields.email.trim(),
          subject: this.fields.subject.trim(),
          message: this.fields.message.trim(),
          browserDevice: this.fields.browserDevice.trim(),
        }),
      });
      if (!response.ok) throw new Error('Contact service rejected the submission');
      this.state.set('sent');
      form.resetForm();
    } catch {
      this.state.set('error');
    }
  }
}
