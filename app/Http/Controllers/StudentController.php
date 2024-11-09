<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class StudentController extends Controller
{

    public function index()
    {
        $students = Student::latest()->paginate(10);
        return Inertia::render('Student/Index', [
            'students' => $students
        ]);
    }

    public function create()
    {
        return Inertia::render('Student/AddStudent');
    }

    public function store(Request $request)
    {
        // Log::info("Request: " . json_en  code($request->all()));
        $requestData = [
            'childName' => $request->childName,
            'dateOfBirth' => $request->dateOfBirth,
            'class' => $request->class,
            'address' => $request->address,
            'city' => $request->city,
            'state' => $request->state,
            'country' => $request->country,
            'zipCode' => $request->zipCode,
            'photo' => $request->photo,
            'pickupPersons' => json_decode($request->pickupPersons, true),
        ];

        $validator = Validator::make($requestData, [
            'childName' => 'required|string|max:255',
            'dateOfBirth' => 'required|date',
            'class' => 'required|string',
            'address' => 'required|string', 
            'city' => 'required|string',
            'state' => 'required|string',
            'country' => 'required|string|size:2',
            'zipCode' => 'required|string|size:7',
            'photo' => 'required|image|mimes:jpg,jpeg,png|max:1024|dimensions:min_width=100,min_height=100',
            'pickupPersons' => 'required|array|min:1|max:6',
            'pickupPersons.*.name' => 'required|string|max:255',
            'pickupPersons.*.relation' => 'required|string|in:Father,Mother,Brother,Sister,Grandfather,Grandmother',
            'pickupPersons.*.contactNumber' => 'required|string|size:10'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => 'Validation failed', 'errors' => $validator->errors()]);
        }

        $validated = $validator->validated();
        // Log::info("Validated Values : " . json_encode($validated));

        try {
            // Check if image exists in request
            if ($request->hasFile('photo')) {
                // Get the image file
                $photo = $request->file('photo');

                // Generate unique filename
                $filename = (time() * time()) . '.' . $photo->getClientOriginalExtension();

                // Store image in storage/app/public/student-images directory
                $path = $photo->storeAs('student-images', $filename, 'public');

                // Update photo path in validated data
                $validated['photo'] = $path;
            }

            // Convert camelCase to snake_case for database columns
            $studentData = [
                'child_name' => $validated['childName'],
                'date_of_birth' => $validated['dateOfBirth'],
                'class' => $validated['class'],
                'address' => $validated['address'],
                'city' => $validated['city'],
                'state' => $validated['state'],
                'country' => $validated['country'],
                'zip_code' => $validated['zipCode'],
                'photo_path' => $filename ?? null
            ];

            // Create student record
            $student = Student::create($studentData);
            // Log::info("Student created: " . json_encode($student));
            // Create pickup persons records
            foreach ($validated['pickupPersons'] as $person) {
                $pickupPerson = $student->pickupPersons()->create([
                    'name' => $person['name'],
                    'relation' => $person['relation'],
                    'contact_number' => $person['contactNumber']
                ]);
                // Log::info("Pickup person created: " . json_encode($pickupPerson));
            }

            return response()->json(['success' => true, 'message' => 'Student added successfully']);

        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'An error occurred while adding the student. Please try again.'
            ])->withInput();
        }

    }

    public function destroy($id)
    {
        $student = Student::findOrFail($id);
        $student->delete();
        return response()->json(['success' => true, 'message' => 'Student deleted successfully']);
    }

    public function show($id)
    {
        $student = Student::where('id', $id)->with('pickupPersons')->first();
        return Inertia::render('Student/ViewStudent', [
            'student' => $student
        ]);
    }

    public function edit($id)
    {
        $student = Student::where('id', $id)->with('pickupPersons')->first();
        // Log::info("Student: " . json_encode($student));
        return Inertia::render('Student/EditStudent', [
            'student' => $student
        ]);
    }

    public function update(Request $request, $id)
    {
        // Log::info("Request: " . json_encode($request->all()));

        $student = Student::findOrFail($id);

        // validate the request
        $requestData = [
            'child_name' => $request->childName,
            'date_of_birth' => $request->dateOfBirth,
            'class' => $request->class,
            'address' => $request->address,
            'city' => $request->city,
            'state' => $request->state,
            'country' => $request->country,
            'zip_code' => $request->zipCode,
            'photo' => $request->photo == 'null' ? null : $request->photo,
            'pickup_persons' => json_decode($request->pickupPersons, true),
        ];

        $validator = Validator::make($requestData, [
            'child_name' => 'required|string|max:255',
            'date_of_birth' => 'required|date',
            'class' => 'required|string',
            'address' => 'required|string', 
            'city' => 'required|string',
            'state' => 'required|string',
            'country' => 'required|string|size:2',
            'zip_code' => 'required|string|size:7',
            'photo' => 'nullable|sometimes|image|mimes:jpg,jpeg,png|max:1024|dimensions:min_width=100,min_height=100',
            'pickup_persons' => 'required|array|min:1|max:6',
            'pickup_persons.*.id' => 'required|integer',
            'pickup_persons.*.remove' => 'sometimes|boolean',
            'pickup_persons.*.name' => 'required|string|max:255',
            'pickup_persons.*.relation' => 'required|string|in:Father,Mother,Brother,Sister,Grandfather,Grandmother',
            'pickup_persons.*.contact_number' => 'required|string|size:10'
        ]);
        if ($validator->fails()) {
            // Log::info("Validation failed: " . json_encode($validator->errors()));
            return response()->json(['success' => false, 'message' => 'Validation failed', 'errors' => $validator->errors()]);
        }

        $validated = $validator->validated();
        // Log::info("Validated Values : " . json_encode($validated));

        // check for image value
        if ($request->hasFile('photo')) {
            // get the image file
            $photo = $request->file('photo');

            // generate unique filename
            $filename = (time() * time()) . '.' . $photo->getClientOriginalExtension();

            // store image in storage/app/public/student-images directory
            $path = $photo->storeAs('student-images', $filename, 'public');

            // update photo path in validated data
            $validated['photo_path'] = $filename;

            // after storing the image, delete the older image from storage
            Storage::disk('public')->delete('student-images/' . $student->photo_path);
        }
        
        // update the student record
        $student->update([
            'child_name' => $validated['child_name'],
            'date_of_birth' => $validated['date_of_birth'],
            'class' => $validated['class'],
            'address' => $validated['address'],
            'city' => $validated['city'],
            'state' => $validated['state'],
            'country' => $validated['country'],
            'zip_code' => $validated['zip_code'],
            'photo_path' => $validated['photo_path'] ?? $student->photo_path
        ]);
        
        // update the pickup persons records
        foreach ($validated['pickup_persons'] as $person) {
            if (isset($person['remove']) && $person['remove'] === true) {
                // Delete the pickup person record
                $student->pickupPersons()->where('id', $person['id'])->delete();
                // Log::info("Pickup person deleted: " . $person['id']);
            } else {
                // Update the pickup person record
                $pickupPerson = $student->pickupPersons()->where('id', $person['id'])->update([
                    'name' => $person['name'],
                    'relation' => $person['relation'],
                    'contact_number' => $person['contact_number']
                ]);
                // Log::info("Pickup person updated: " . json_encode($pickupPerson));
            }
        }

        return response()->json(['success' => true, 'message' => 'Student updated successfully']);
    }
}
