<?php

namespace App\Http\Controllers;

use App\Models\Procedure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProcedureController extends Controller
{
    private function normalizeCnpj(?string $cnpj): ?string
    {
        if ($cnpj === null || trim($cnpj) === '') {
            return null;
        }

        $digits = preg_replace('/\D/', '', $cnpj);

        return $digits === '' ? null : $digits;
    }

    private function codeAndCnpjExists(string $code, ?string $cnpj, ?int $exceptId = null): bool
    {
        $query = Procedure::query()
            ->where('code', $code)
            ->when($exceptId !== null, fn ($q) => $q->where('id', '!=', $exceptId));

        if ($cnpj === null) {
            $query->whereNull('cnpj');
        } else {
            $query->where('cnpj', $cnpj);
        }

        return $query->exists();
    }

    public function index(Request $request): JsonResponse
    {
        $term = trim((string) $request->query('term'));
        $code = trim((string) $request->query('code'));

        if ($term === '' && $code === '') {
            return response()->json([
                'data' => Procedure::query()
                    ->orderBy('provider')
                    ->orderBy('code')
                    ->get()
                    ->map(fn (Procedure $procedure) => $procedure->toSearchResult()),
            ]);
        }

        $query = Procedure::query();

        if ($term !== '') {
            $digits = preg_replace('/\D/', '', $term);

            $query->where(function ($q) use ($term, $digits) {
                $q->where('provider', 'like', "%{$term}%");

                if ($digits !== '') {
                    $q->orWhere('cnpj', $digits);
                }
            });
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
            'cnpj' => ['nullable', 'string', 'regex:/^(\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}|\d{14})$/'],
            'code' => ['required', 'string', 'max:50'],
            'code_to_authorize' => ['nullable', 'string', 'max:50'],
            'description' => ['required', 'string', 'max:255'],
            'deadline_ambulatory' => ['nullable', 'string', 'max:50'],
            'deadline_hospitalization' => ['nullable', 'string', 'max:100'],
            'requires_justification' => ['nullable', 'boolean'],
            'authorization_coopanest' => ['nullable', 'boolean'],
            'operational_notes' => ['nullable', 'array'],
            'operational_notes.*' => ['string'],
        ]);

        $cnpj = $this->normalizeCnpj($validated['cnpj'] ?? null);

        if ($this->codeAndCnpjExists($validated['code'], $cnpj)) {
            return response()->json([
                'message' => 'Já existe um procedimento com este código para o mesmo CNPJ do prestador. O código só pode ser repetido para CNPJ diferentes.',
            ], 422);
        }

        $procedure = Procedure::create([
            'provider' => $validated['provider'],
            'cnpj' => $cnpj,
            'code' => $validated['code'],
            'code_to_authorize' => $validated['code_to_authorize'] ?? null,
            'description' => $validated['description'],
            'deadline_ambulatory' => $validated['deadline_ambulatory'] ?? '',
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
            'cnpj' => ['nullable', 'string', 'regex:/^(\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}|\d{14})$/'],
            'code' => ['required', 'string', 'max:50'],
            'code_to_authorize' => ['nullable', 'string', 'max:50'],
            'description' => ['required', 'string', 'max:255'],
            'deadline_ambulatory' => ['nullable', 'string', 'max:50'],
            'deadline_hospitalization' => ['nullable', 'string', 'max:100'],
            'requires_justification' => ['nullable', 'boolean'],
            'authorization_coopanest' => ['nullable', 'boolean'],
            'operational_notes' => ['nullable', 'array'],
            'operational_notes.*' => ['string'],
        ]);

        $cnpj = $this->normalizeCnpj($validated['cnpj'] ?? null);

        if ($this->codeAndCnpjExists($validated['code'], $cnpj, $id)) {
            return response()->json([
                'message' => 'Já existe um procedimento com este código para o mesmo CNPJ do prestador. O código só pode ser repetido para CNPJ diferentes.',
            ], 422);
        }

        $procedure->update([
            'provider' => $validated['provider'],
            'cnpj' => $cnpj,
            'code' => $validated['code'],
            'code_to_authorize' => $validated['code_to_authorize'] ?? null,
            'description' => $validated['description'],
            'deadline_ambulatory' => $validated['deadline_ambulatory'] ?? '',
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
