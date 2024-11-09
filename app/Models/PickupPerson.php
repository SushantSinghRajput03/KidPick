<?php

namespace App\Models;

use App\Models\Student;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PickupPerson extends Model
{
    /** @use HasFactory<\Database\Factories\PickupPersonFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'relation',
        'contact_number',
        'student_id',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}
