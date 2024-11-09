import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import axios from 'axios';

export default function EditStudent({ student }) {
    const { Inertia } = usePage();
    const { data, setData, processing, errors, reset } = useForm({
        childName: student.child_name || '',
        dateOfBirth: student.date_of_birth ? new Date(student.date_of_birth).toISOString().split('T')[0] : '',
        class: student.class || '',
        address: student.address || '',
        city: student.city || '',
        state: student.state || '',
        country: student.country || '',
        zipCode: student.zip_code || '',
        photo: null,
        photo_path: student.photo_path ? `/storage/student-images/${student.photo_path}` : null,
        pickupPersons: student.pickup_persons || [{
            name: '',
            relation: '',
            contact_number: '',
            removed: false
        }]
    });

    const [states, setStates] = useState([]);
    const [previewUrl, setPreviewUrl] = useState(student.photo_url || null);

    const classes = Array.from({length: 12}, (_, i) => `Class ${i + 1}`);
    
    const countries = [
        { code: 'IN', name: 'India' },
        { code: 'US', name: 'United States' },
        // Add more countries as needed
    ];

    const indianStates = [
        'Andhra Pradesh', 'Karnataka', 'Kerala', 'Tamil Nadu', 
        // Add more states
    ];

    const usStates = [
        'California', 'New York', 'Texas', 'Florida',
        // Add more states
    ];

    const relations = ['Father', 'Mother', 'Brother', 'Sister', 'Grandfather', 'Grandmother'];

    useEffect(() => {
        if (data.country === 'IN') {
            setStates(indianStates);
        } else if (data.country === 'US') {
            setStates(usStates);
        } else {
            setStates([]);
        }
    }, [data.country]);

    useEffect(() => {
        // Set initial states based on student's country
        if (student.country === 'IN') {
            setStates(indianStates);
        } else if (student.country === 'US') {
            setStates(usStates);
        }

        // Set initial preview URL from student photo
        if (data.photo_path) {
            setPreviewUrl(data.photo_path);
        }
    }, []);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            if (!validTypes.includes(file.type)) {
                toast.error('Please upload JPG, JPEG or PNG files only');
                return;
            }

            // Validate file size (1MB = 1024 * 1024 bytes)
            if (file.size > 1024 * 1024) {
                toast.error('File size should not exceed 1MB');
                return;
            }

            // Create preview URL
            const url = URL.createObjectURL(file);
            
            // Validate image dimensions
            const img = new Image();
            img.onload = () => {
                if (img.width < 100 || img.height < 100) {
                    toast.error('Image resolution should be at least 100x100 pixels');
                    setPreviewUrl(data.photo_path || null);
                    return;
                }
                setPreviewUrl(url);
                setData('photo', file);
            };
            img.src = url;
        }
    };

    const handlePickupPersonChange = (index, field, value) => {
        const updatedPickupPersons = [...data.pickupPersons];
        updatedPickupPersons[index] = {
            ...updatedPickupPersons[index],
            [field]: value
        };
        setData('pickupPersons', updatedPickupPersons);
    };

    const addPickupPerson = () => {
        if (data.pickupPersons.length < 6) {
            setData('pickupPersons', [
                ...data.pickupPersons,
                { name: '', relation: '', contactNumber: '' }
            ]);
        } else {
            toast.error('Maximum 6 pickup persons allowed. Please remove one to add another.');
        }
    };

    const removePickupPerson = (index) => {
        if (data.pickupPersons.length > 1) {
            const updatedPickupPersons = data.pickupPersons.map((person, i) => {
                if (i === index) {
                    return { ...person, remove: true };
                }
                return person;
            });
            setData('pickupPersons', updatedPickupPersons);
            console.log('updatedPickupPersons after removing: ', updatedPickupPersons);
        }
    };

    const submit = async (e) => {
        e.preventDefault();

        try {
            // Get CSRF token
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

            // Create FormData object to handle file upload
            const formData = new FormData();
            for (const key in data) {
                if (key === 'pickupPersons') {
                    formData.append(key, JSON.stringify(data[key]));
                } else {
                    formData.append(key, data[key]);
                }
            }

            const response = await axios.post(`/edit-student/${student.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-CSRF-TOKEN': csrfToken
                }
            });

            if (response.status) {
                // Show success popup with SweetAlert2
                Swal.fire({
                    title: 'Success!',
                    text: 'Student information updated successfully',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    timer: 3000,
                    timerProgressBar: true
                });

                // Show success toast
                toast.success('Student updated successfully!');
                
                // Redirect after 3 seconds
                setTimeout(() => {
                    window.location.href = '/students';
                }, 3000);
            }
        } catch (error) {
            console.error('Error updating student:', error);
            toast.error('An error occurred while updating student');
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center">
                    <button
                        onClick={() => window.location.href = '/students'}
                        className="mr-4"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                    </button>
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Student</h2>
                </div>
            }
        >
            <Head title="Edit Student" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <InputLabel htmlFor="childName" value="Child Name" />
                                        <TextInput
                                            id="childName"
                                            type="text"
                                            name="childName"
                                            value={data.childName}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('childName', e.target.value)}
                                            placeholder="Enter child's full name"
                                            required
                                        />
                                        <InputError message={errors.childName} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="dateOfBirth" value="Date of Birth" />
                                        <TextInput
                                            id="dateOfBirth"
                                            type="date"
                                            name="dateOfBirth"
                                            value={data.dateOfBirth}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('dateOfBirth', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.dateOfBirth} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="class" value="Class" />
                                        <select
                                            id="class"
                                            name="class"
                                            value={data.class}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            onChange={(e) => setData('class', e.target.value)}
                                            required
                                        >
                                            <option value="">Select Class</option>
                                            {classes.map((className) => (
                                                <option key={className} value={className}>
                                                    {className}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.class} className="mt-2" />
                                    </div>
                                </div>

                                <div>
                                    <InputLabel htmlFor="address" value="Address" />
                                    <TextInput
                                        id="address"
                                        type="text"
                                        name="address"
                                        value={data.address}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('address', e.target.value)}
                                        placeholder="Enter street address"
                                        required
                                    />
                                    <InputError message={errors.address} className="mt-2" />
                                </div>

                                <div className="grid grid-cols-4 gap-4">
                                    <div>
                                        <InputLabel htmlFor="city" value="City" />
                                        <TextInput
                                            id="city"
                                            type="text"
                                            name="city"
                                            value={data.city}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('city', e.target.value)}
                                            placeholder="Enter city name"
                                            required
                                        />
                                        <InputError message={errors.city} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="country" value="Country" />
                                        <select
                                            id="country"
                                            name="country"
                                            value={data.country}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            onChange={(e) => setData('country', e.target.value)}
                                            required
                                        >
                                            <option value="">Select Country</option>
                                            {countries.map((country) => (
                                                <option key={country.code} value={country.code}>
                                                    {country.name}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.country} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="state" value="State" />
                                        <select
                                            id="state"
                                            name="state"
                                            value={data.state}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            onChange={(e) => setData('state', e.target.value)}
                                            required
                                        >
                                            <option value="">Select State</option>
                                            {states.map((state) => (
                                                <option key={state} value={state}>
                                                    {state}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.state} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="zipCode" value="Zip Code" />
                                        <TextInput
                                            id="zipCode"
                                            type="text"
                                            name="zipCode"
                                            value={data.zipCode}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('zipCode', e.target.value)}
                                            pattern="[0-9]{7}"
                                            maxLength="7"
                                            placeholder="1234567"
                                            required
                                        />
                                        <InputError message={errors.zipCode} className="mt-2" />
                                    </div>
                                </div>

                                <div>
                                    <InputLabel htmlFor="photo" value="Child Photo" />
                                    <div className="mt-1 grid grid-cols-4 gap-4">
                                        <div className="col-span-3">
                                            <label
                                                htmlFor="photo"
                                                className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 px-6 transition-colors hover:border-indigo-500 hover:bg-indigo-50"
                                            >
                                                <div className="space-y-1 text-center">
                                                    {!previewUrl && (
                                                        <svg
                                                            className="mx-auto h-12 w-12 text-gray-400"
                                                            stroke="currentColor"
                                                            fill="none"
                                                            viewBox="0 0 48 48"
                                                        >
                                                            <path
                                                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                                strokeWidth={2}
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </svg>
                                                    )}
                                                    <div className="text-sm text-gray-600">
                                                        <span className="font-medium text-indigo-600 hover:text-indigo-500">
                                                            {previewUrl ? 'Change photo' : 'Upload a photo'}
                                                        </span>
                                                        <input
                                                            id="photo"
                                                            name="photo"
                                                            type="file"
                                                            className="sr-only"
                                                            onChange={handlePhotoChange}
                                                            accept=".jpg,.jpeg,.png"
                                                        />
                                                    </div>
                                                    <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                                                </div>
                                            </label>
                                        </div>
                                        
                                        <div className="col-span-1">
                                            {previewUrl ? (
                                                <div className="relative h-32 w-full">
                                                    <img
                                                        src={previewUrl}
                                                        alt="Preview"
                                                        className="h-full w-full rounded-lg object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setPreviewUrl(data.photo_path || null);
                                                            setData('photo', null);
                                                        }}
                                                        className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                                                    >
                                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex h-32 w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-200">
                                                    <span className="text-sm text-gray-400">Preview</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <InputError message={errors.photo} className="mt-2" />
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-medium">Pickup Persons ({data.pickupPersons.length}/6)</h3>
                                        {data.pickupPersons.length < 6 && (
                                            <button
                                                type="button"
                                                onClick={addPickupPerson}
                                                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                                            >
                                                Add Pickup Person
                                            </button>
                                        )}
                                    </div>

                                    {data.pickupPersons.filter(person => !person.remove).map((person, index) => (
                                        <div key={index} className="rounded-lg border border-gray-200 p-4">
                                            <div className="grid grid-cols-3 gap-4">
                                                <div>
                                                    <InputLabel htmlFor={`name-${index}`} value="Name" />
                                                    <TextInput
                                                        id={`name-${index}`}
                                                        type="text"
                                                        value={person.name}
                                                        className="mt-1 block w-full"
                                                        placeholder="Enter pickup person's name"
                                                        onChange={(e) => handlePickupPersonChange(index, 'name', e.target.value)}
                                                        required
                                                    />
                                                </div>

                                                <div>
                                                    <InputLabel htmlFor={`relation-${index}`} value="Relation" />
                                                    <select
                                                        id={`relation-${index}`}
                                                        value={person.relation}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                        onChange={(e) => handlePickupPersonChange(index, 'relation', e.target.value)}
                                                        required
                                                    >
                                                        <option value="">Select Relation</option>
                                                        {relations.map((relation) => (
                                                            <option key={relation} value={relation}>
                                                                {relation}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div>
                                                    <InputLabel htmlFor={`contactNumber-${index}`} value="Contact Number" />
                                                    <TextInput
                                                        id={`contactNumber-${index}`}
                                                        type="text"
                                                        value={person.contact_number}
                                                        className="mt-1 block w-full"
                                                        onChange={(e) => handlePickupPersonChange(index, 'contact_number', e.target.value)}
                                                        pattern="[0-9]{10}"
                                                        maxLength="10"
                                                        placeholder="Enter 10-digit mobile number"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            {data.pickupPersons.length > 1 && (
                                                <div className="mt-2 flex justify-end">
                                                    <button
                                                        type="button"
                                                        onClick={() => removePickupPerson(index)}
                                                        className="text-sm text-red-600 hover:text-red-500"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className="flex items-center justify-end">
                                    <PrimaryButton className="ms-4" disabled={processing}>
                                        Update Student
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
