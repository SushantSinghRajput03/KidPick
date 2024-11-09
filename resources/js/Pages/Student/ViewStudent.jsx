import { useEffect, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function ViewStudent({ auth, student }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => window.location.href = '/students'}
                        className="text-gray-600 hover:text-gray-900"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                    </button>
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Student Details</h2>
                </div>
            }
        >
            <Head title="Student Details" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    {student.photo_path && (
                                        <div className="mb-6">
                                            <img 
                                                src={`/storage/student-images/${student.photo_path}`}
                                                alt={student.child_name}
                                                className="w-48 h-48 object-cover rounded-lg"
                                            />
                                        </div>
                                    )}
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-lg font-semibold">Personal Information</h3>
                                            <p><span className="font-medium">Name:</span> {student.child_name}</p>
                                            <p><span className="font-medium">Date of Birth:</span> {new Date(student.date_of_birth).toLocaleDateString()}</p>
                                            <p><span className="font-medium">Class:</span> {student.class}</p>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold">Address</h3>
                                            <p>{student.address}</p>
                                            <p>{student.city}, {student.state}</p>
                                            <p>{student.country}, {student.zip_code}</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Authorized Pickup Persons</h3>
                                    <div className="space-y-4">
                                        {student.pickup_persons.map((person, index) => (
                                            <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                                <p><span className="font-medium">Name:</span> {person.name}</p>
                                                <p><span className="font-medium">Relation:</span> {person.relation}</p>
                                                <p><span className="font-medium">Contact:</span> {person.contact_number}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
