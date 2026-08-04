<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    private function serialize(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->effectiveRole(),
            'is_active' => $user->is_active,
        ];
    }

    public function index(): JsonResponse
    {
        return response()->json([
            'data' => User::query()
                ->orderBy('name')
                ->get()
                ->map(fn (User $user) => $this->serialize($user)),
        ]);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $user = User::query()->find($id);

        if (!$user) {
            return response()->json([
                'message' => 'Usuário não encontrado.',
            ], 404);
        }

        return response()->json([
            'data' => $this->serialize($user),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:150'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6'],
            'role' => ['required', Rule::in(User::ROLES)],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'],
            'role' => $validated['role'],
        ]);

        return response()->json([
            'data' => $this->serialize($user),
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $user = User::query()->find($id);

        if (!$user) {
            return response()->json([
                'message' => 'Usuário não encontrado.',
            ], 404);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:150'],
            'email' => ['required', 'email', "unique:users,email,{$id}"],
            'password' => ['nullable', 'string', 'min:6'],
            'role' => ['required', Rule::in(User::ROLES)],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $data = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'is_active' => $validated['is_active'] ?? $user->is_active,
        ];

        if (!empty($validated['password'])) {
            $data['password'] = $validated['password'];
        }

        $user->update($data);

        return response()->json([
            'data' => $this->serialize($user->fresh()),
            'message' => 'Usuário atualizado com sucesso.',
        ]);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $user = User::query()->find($id);

        if (!$user) {
            return response()->json([
                'message' => 'Usuário não encontrado.',
            ], 404);
        }

        $user->delete();

        return response()->json([
            'message' => 'Usuário excluído com sucesso.',
        ], 200);
    }
}