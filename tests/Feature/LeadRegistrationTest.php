<?php

namespace Tests\Feature;

use App\Models\Package;
use App\Models\Registration;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LeadRegistrationTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test successful AJAX registration.
     */
    public function test_can_register_lead_via_ajax(): void
    {
        $package = Package::create([
            'name' => 'Test Pack',
            'slug' => 'test-pack',
            'speed' => '50 Mbps',
            'price' => 200000,
            'category' => 'home',
            'is_active' => true,
        ]);

        $response = $this->postJson(route('register.lead'), [
            'name' => 'John Doe',
            'email' => 'johndoe@example.com',
            'phone' => '081234567890',
            'address' => 'Jl. Merdeka No. 10, Jakarta',
            'package_id' => $package->id,
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);

        $this->assertDatabaseHas('registrations', [
            'name' => 'John Doe',
            'email' => 'johndoe@example.com',
            'phone' => '081234567890',
            'address' => 'Jl. Merdeka No. 10, Jakarta',
            'package_id' => $package->id,
            'status' => 'pending',
        ]);
    }

    /**
     * Test AJAX registration validation failure.
     */
    public function test_cannot_register_with_missing_fields(): void
    {
        $response = $this->postJson(route('register.lead'), [
            'name' => '',
            'email' => 'not-an-email',
            'phone' => '',
            'address' => '',
        ]);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
            ])
            ->assertJsonValidationErrors(['name', 'email', 'phone', 'address']);

        $this->assertDatabaseCount('registrations', 0);
    }
}
