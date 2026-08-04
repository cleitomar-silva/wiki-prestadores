<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProcedureController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::post('auth/login', [AuthController::class, 'login'])->name('auth.login');

Route::get('users', [UserController::class, 'index'])->name('users.index');
Route::post('users', [UserController::class, 'store'])->name('users.store');
Route::get('users/{id}', [UserController::class, 'show'])->name('users.show');
Route::put('users/{id}', [UserController::class, 'update'])->name('users.update');
Route::delete('users/{id}', [UserController::class, 'destroy'])->name('users.destroy');

Route::get('procedures', [ProcedureController::class, 'index'])->name('procedures.index');
Route::get('procedures/{id}', [ProcedureController::class, 'show'])->name('procedures.show');
Route::post('procedures', [ProcedureController::class, 'store'])->name('procedures.store');
Route::put('procedures/{id}', [ProcedureController::class, 'update'])->name('procedures.update');
Route::delete('procedures/{id}', [ProcedureController::class, 'destroy'])->name('procedures.destroy');
