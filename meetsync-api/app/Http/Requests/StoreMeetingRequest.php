<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMeetingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title'            => ['required', 'string', 'max:255'],
            'description'      => ['nullable', 'string'],
            'start_at'         => ['required', 'date', 'after:now'],
            'duration_minutes' => ['required', 'integer', 'min:15'],
            'location'         => ['nullable', 'string', 'max:255'],
            'reminder_minutes' => ['integer', 'in:15,30,60,1440'],
            'participant_ids'  => ['array'],
            'participant_ids.*' => ['exists:users,id'],
        ];
    }
}