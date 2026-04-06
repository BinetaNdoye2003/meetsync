<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\MeetingController;
use App\Http\Controllers\InvitationController;
use Illuminate\Support\Facades\Route;

// ── Publiques ─────────────────────────────────────
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// ── Liens email (sans token) ──────────────────────
Route::get('/invitations/{invitation}/accept',
    [InvitationController::class, 'acceptViaLink']);
Route::get('/invitations/{invitation}/refuse',
    [InvitationController::class, 'refuseViaLink']);

// ── Protégées ─────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);

    // Meetings — upcoming AVANT {meeting} !
    Route::get('/meetings',          [MeetingController::class, 'index']);
    Route::post('/meetings',         [MeetingController::class, 'store']);
    Route::get('/meetings/upcoming', [MeetingController::class, 'upcoming']);
    Route::get('/meetings/{meeting}',    [MeetingController::class, 'show']);
    Route::delete('/meetings/{meeting}', [MeetingController::class, 'destroy']);

    // Invitations
    Route::post('/meetings/{meeting}/invitations',
        [InvitationController::class, 'store']);
    Route::patch('/invitations/{invitation}',
        [InvitationController::class, 'update']);

    // Users
    Route::get('/users', fn() => response()->json(
        \App\Models\User::select('id', 'name', 'email')->get()
    ));
});