<?php

namespace Database\Seeders;

use App\Models\Procedure;
use Illuminate\Database\Seeder;

class ProcedureSeeder extends Seeder
{
    public function run(): void
    {
$procedures = [
            [
                'provider' => 'Hospital Central Sǜo Lucas',
                'code' => '40304361',
                'description' => 'Hemoglobina Glicada (Fra����es A1C) - pesquisa e/ou dosagem por cromatografia l��quida de alta performance (HPLC)',
                'deadline_ambulatory' => '60 dias',
                'deadline_urgency' => '2026-09-30',
                'deadline_hospitalization' => '5 dias ap��s alta',
                'requires_justification' => true,
                'authorization_coopanest' => true,
                'operational_notes' => [
                    'Exige autoriza��ǜo prǸvia para pacientes com idade superior a 65 anos ou hist��rico de diabetes cr��nica.',
                    'FrequǦncia mǭxima permitida: 1 procedimento a cada 90 dias, salvo justificativa mǸdica detalhada.',
                    'Necessǭrio envio de laudo tǸcnico digitalizado anexo �� guia de faturamento.',
                ],
            ],
            [
                'provider' => 'Cl��nica Santa Clara',
                'code' => '40902022',
                'description' => 'Ressonǽncia MagnǸtica do EncǸfalo, com contraste',
                'deadline_ambulatory' => '30 dias',
                'deadline_urgency' => '2026-09-15',
                'deadline_hospitalization' => '2 dias ap��s alta',
                'requires_justification' => true,
                'authorization_coopanest' => false,
                'operational_notes' => [
                    'Requer solicita��ǜo mǸdica com CID-10 preenchido e justificativa cl��nica.',
                    'Contraste iodado somente com avalia��ǜo prǸvia de fun��ǜo renal.',
                    'Prontuǭrio deve ser anexado ao sistema em atǸ 24h ap��s o exame.',
                ],
            ],
            [
                'provider' => 'Instituto Vida - Oncologia',
                'code' => '30101210',
                'description' => 'Quimioterapia antineoplǭsica oral ou endovenosa - 1�� mǦs de tratamento',
                'deadline_ambulatory' => '90 dias',
                'deadline_urgency' => '2026-10-31',
                'deadline_hospitalization' => '5 dias ap��s alta',
                'requires_justification' => false,
                'authorization_coopanest' => true,
                'operational_notes' => [
                    'Laudo de oncologista e exames de estadiamento sǜo obrigat��rios.',
                    'Renova��ǜo mensal com evolu��ǜo do paciente e resposta terapǦutica.',
                    'C��digo de autoriza��ǜo deve ser informado em toda guia de faturamento.',
                ],
            ],
        ];

        foreach ($procedures as $procedure) {
            Procedure::updateOrCreate(
                ['code' => $procedure['code']],
                $procedure,
            );
        }
    }
}
