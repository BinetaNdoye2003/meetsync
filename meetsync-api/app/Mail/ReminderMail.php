<?php

namespace App\Mail;

use App\Models\Meeting;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ReminderMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Meeting $meeting
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Rappel : ' . $this->meeting->title . ' dans 15 min',
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.reminder',
            with: ['meeting' => $this->meeting],
        );
    }
}