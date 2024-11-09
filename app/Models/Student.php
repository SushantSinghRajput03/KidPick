<?php

namespace App\Models;

use App\Models\PickupPerson;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Student extends Model
{
    use HasFactory;
    protected $fillable = [
        'child_name',
        'date_of_birth',
        'class',
        'address',
        'city',
        'state',
        'country',
        'zip_code',
        'photo_path',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
    ];

    public function pickupPersons()
    {
        return $this->hasMany(PickupPerson::class)->limit(6);
    }
}
