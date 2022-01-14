import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";

import {NewStream, UserStream} from "../../shared/model/stream-model";

@Component({
    selector: 'edge-stream-form',
    templateUrl: './stream-form.component.html',
    styleUrls: ['./stream-form.component.scss']
})
export class StreamFormComponent implements OnInit {

    @Input() formData!: UserStream;
    @Output() formSubmitted = new EventEmitter();
    @Output() cancel = new EventEmitter();
    form!: FormGroup;
    invited: string[] = [];
    newInvitation: string = '';

    private readonly MIN_USERNAME_LENGTH = 2;

    constructor(private fb: FormBuilder) {
    }

    ngOnInit(): void {
        this.initializeEmptyForm();
        if (this.formData) {
            this.patchFormValues(this.formData)
        }
    }

    onSubmit(): void {
        if (this.form.valid) {
            this.formSubmitted.emit(this.mapFormValuesToNewStreamDto())
        }
    }

    onCancel(): void {
        this.cancel.emit();
    }

    inviteUser() {
        if (this.newInvitation.length > this.MIN_USERNAME_LENGTH) {
            const alreadyAddedIndex = this.invited.findIndex(user => user === this.newInvitation);
            if (alreadyAddedIndex < 0) {
                this.invited.push(this.newInvitation);
            }
            this.newInvitation = '';
        }
    }

    removeFromInvited(userIndex: number) {
        this.invited.splice(userIndex, 1);
    }

    private initializeEmptyForm(): void {
        this.form = this.fb.group(
            {
                title: [''],
                description: [''],
                thumbnail: ['', [Validators.required, StreamFormComponent.urlValidator]],
                type: '',
            });
    }

    private static urlValidator({value}: AbstractControl): null | ValidationErrors {
        try {
            new URL(value);
            return null;
        } catch {
            return {pattern: true};
        }
    }

    private mapFormValuesToNewStreamDto(): NewStream {
        const invitations = this.form.get('type')?.value === 'PUBLIC' ? [] : this.invited;
        return {
            title: this.form.get('title')?.value,
            description: this.form.get('description')?.value,
            thumbnail: this.form.get('thumbnail')?.value,
            type: this.form.get('type')?.value,
            invited: invitations
        };
    }

    private patchFormValues(stream: UserStream) {
        this.form.patchValue(stream);
        this.invited = stream.invited;
    }

}
