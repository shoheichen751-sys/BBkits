<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreBOMRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() && $this->user()->role === 'admin';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'items' => 'required|array|min:1',
            'items.*.material_id' => 'required|exists:materials,id',
            'items.*.quantity' => 'required|numeric|min:0.001',
            'items.*.unit' => 'required|string|max:50',
            'items.*.notes' => 'nullable|string|max:500',
            'items.*.is_active' => 'boolean',
            'items.*.variants' => 'nullable|array',
            'items.*.variants.*.size' => 'nullable|string|max:20',
            'items.*.variants.*.color' => 'nullable|string|max:50',
            'items.*.variants.*.quantity_override' => 'nullable|numeric|min:0.001',
            'items.*.variants.*.material_id_override' => 'nullable|exists:materials,id',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'items.required' => 'A ficha técnica precisa ter pelo menos um material.',
            'items.min' => 'A ficha técnica precisa ter pelo menos um material.',
            'items.*.material_id.required' => 'Selecione um material.',
            'items.*.material_id.exists' => 'Material inválido.',
            'items.*.quantity.required' => 'Informe a quantidade.',
            'items.*.quantity.numeric' => 'A quantidade deve ser um número.',
            'items.*.quantity.min' => 'A quantidade deve ser maior que zero.',
            'items.*.unit.required' => 'Informe a unidade de medida.',
            'items.*.unit.max' => 'A unidade de medida é muito longa.',
            'items.*.notes.max' => 'As observações são muito longas.',
            'items.*.variants.*.quantity_override.numeric' => 'A quantidade da variação deve ser um número.',
            'items.*.variants.*.quantity_override.min' => 'A quantidade da variação deve ser maior que zero.',
            'items.*.variants.*.material_id_override.exists' => 'Material de substituição inválido.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'items' => 'materiais',
            'items.*.material_id' => 'material',
            'items.*.quantity' => 'quantidade',
            'items.*.unit' => 'unidade',
            'items.*.notes' => 'observações',
        ];
    }
}
