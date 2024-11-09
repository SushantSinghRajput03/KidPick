<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Student>
 */
class StudentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'child_name' => fake()->name(),
            'date_of_birth' => fake()->date(),
            'class' => fake()->randomElement(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']),
            'address' => fake()->address(),
            'city' => fake()->city(),
            'state' => fake()->state(),
            'country' => fake()->country(),
            'zip_code' => fake()->postcode(),
            'photo_path' => fake()->imageUrl(),
        ];
    }
}
