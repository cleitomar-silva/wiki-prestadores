<?php

return [
    'accepted' => 'O campo :attribute deve ser aceito.',
    'array' => 'O campo :attribute deve ser uma lista.',
    'boolean' => 'O campo :attribute deve ser verdadeiro ou falso.',
    'date' => 'O campo :attribute não é uma data válida.',
    'max' => [
        'array' => 'O campo :attribute não pode ter mais de :max itens.',
        'file' => 'O campo :attribute não pode ser maior que :max kilobytes.',
        'numeric' => 'O campo :attribute não pode ser maior que :max.',
        'string' => 'O campo :attribute deve ter no máximo :max caracteres.',
    ],
    'required' => 'O campo :attribute é obrigatório.',
    'regex' => 'O campo :attribute deve conter um CNPJ válido com 14 números.',
    'string' => 'O campo :attribute deve ser um texto.',
    'unique' => 'O campo :attribute já está em uso.',
    'attributes' => [
        'provider' => 'Prestador',
        'cnpj' => 'CNPJ do Prestador',
        'code' => 'Código do Procedimento',
        'code_to_authorize' => 'Qual código deve ser autorizado',
        'description' => 'Descrição do Procedimento',
        'deadline_ambulatory' => 'Prazo Apresentação Conta',
        'deadline_hospitalization' => 'Formato de Entrega',
        'requires_justification' => 'Precisa de justificativa',
        'authorization_coopanest' => 'Autorização em nome da Coopanest',
        'operational_notes' => 'Observações',
    ],
];
