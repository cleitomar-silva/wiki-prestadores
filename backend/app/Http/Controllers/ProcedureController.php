<?php

namespace App\Http\Controllers;

use App\Models\Procedure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProcedureController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $provider = trim((string) $request->query('provider'));
        $code = trim((string) $request->query('code'));

        if ($provider === '' && $code === '') {
            return response()->json([
                'data' => Procedure::query()
                    ->orderBy('provider')
                    ->orderBy('code')
                    ->get()
                    ->map(fn (Procedure $procedure) => $procedure->toSearchResult()),
            ]);
        }

        $query = Procedure::query();

        if ($provider !== '') {
            $query->where('provider', 'like', "%{$provider}%");
        }

        if ($code !== '') {
            $query->where('code', 'like', "%{$code}%");
        }

        $procedures = $query->orderBy('provider')->orderBy('code')->get();

        if ($procedures->isEmpty()) {
            return response()->json([
                'data' => [],
                'message' => 'Nenhum procedimento encontrado para os critérios informados.',
            ]);
        }

        return response()->json([
            'data' => $procedures->map(fn (Procedure $procedure) => $procedure->toSearchResult()),
        ]);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $procedure = Procedure::query()->find($id);

        if (!$procedure) {
            return response()->json([
                'message' => 'Procedimento não encontrado.',
            ], 404);
        }

        return response()->json([
            'data' => $procedure->toSearchResult(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'provider' => ['required', 'string', 'max:150'],
            'code' => ['required', 'string', 'max:50', 'unique:procedures,code'],
            'code_to_authorize' => ['nullable', 'string', 'max:50', 'unique:procedures,code_to_authorize'],
            'description' => ['required', 'string', 'max:255'],
            'deadline_ambulatory' => ['nullable', 'string', 'max:50'],
            'deadline_urgency' => ['nullable', 'date'],
            'deadline_hospitalization' => ['nullable', 'string', 'max:100'],
            'requires_justification' => ['nullable', 'boolean'],
            'authorization_coopanest' => ['nullable', 'boolean'],
            'operational_notes' => ['nullable', 'array'],
            'operational_notes.*' => ['string'],
        ]);

        $procedure = Procedure::create([
            'provider' => $validated['provider'],
            'code' => $validated['code'],
            'code_to_authorize' => $validated['code_to_authorize'] ?? null,
            'description' => $validated['description'],
            'deadline_ambulatory' => $validated['deadline_ambulatory'] ?? '',
            'deadline_urgency' => $validated['deadline_urgency'] ?? null,
            'deadline_hospitalization' => $validated['deadline_hospitalization'] ?? '',
            'requires_justification' => $validated['requires_justification'] ?? false,
            'authorization_coopanest' => $validated['authorization_coopanest'] ?? true,
            'operational_notes' => $validated['operational_notes'] ?? [],
        ]);

        return response()->json([
            'data' => $procedure->toSearchResult(),
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $procedure = Procedure::query()->find($id);

        if (!$procedure) {
            return response()->json([
                'message' => 'Procedimento não encontrado.',
            ], 404);
        }

        $validated = $request->validate([
            'provider' => ['required', 'string', 'max:150'],
            'code' => ['required', 'string', 'max:50', "unique:procedures,code,{$id}"],
            'code_to_authorize' => ['nullable', 'string', 'max:50', "unique:procedures,code_to_authorize,{$id}"],
            'description' => ['required', 'string', 'max:255'],
            'deadline_ambulatory' => ['nullable', 'string', 'max:50'],
            'deadline_urgency' => ['nullable', 'date'],
            'deadline_hospitalization' => ['nullable', 'string', 'max:100'],
            'requires_justification' => ['nullable', 'boolean'],
            'authorization_coopanest' => ['nullable', 'boolean'],
            'operational_notes' => ['nullable', 'array'],
            'operational_notes.*' => ['string'],
        ]);

        $procedure->update([
            'provider' => $validated['provider'],
            'code' => $validated['code'],
            'code_to_authorize' => $validated['code_to_authorize'] ?? null,
            'description' => $validated['description'],
            'deadline_ambulatory' => $validated['deadline_ambulatory'] ?? '',
            'deadline_urgency' => $validated['deadline_urgency'] ?? null,
            'deadline_hospitalization' => $validated['deadline_hospitalization'] ?? '',
            'requires_justification' => $validated['requires_justification'] ?? false,
            'authorization_coopanest' => $validated['authorization_coopanest'] ?? true,
            'operational_notes' => $validated['operational_notes'] ?? [],
        ]);

        return response()->json([
            'data' => $procedure->fresh()->toSearchResult(),
            'message' => 'Procedimento atualizado com sucesso.',
        ]);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $procedure = Procedure::query()->find($id);

        if (!$procedure) {
            return response()->json([
                'message' => 'Procedimento não encontrado.',
            ], 404);
        }

        $procedure->delete();

        return response()->json([
            'message' => 'Procedimento excluído com sucesso.',
        ], 200);
    }
}
