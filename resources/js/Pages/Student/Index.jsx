import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useState } from "react";
import { Link } from "@inertiajs/react";
import Swal from "sweetalert2";
import axios from "axios";

export default function Index({ students }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortField, setSortField] = useState("created_at");
    const [sortDirection, setSortDirection] = useState("desc");

    // Filter students based on search term
    const filteredStudents = students.data.filter(
        (student) =>
            student.child_name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            student.class.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort students
    const sortedStudents = [...filteredStudents].sort((a, b) => {
        if (sortDirection === "asc") {
            return a[sortField] > b[sortField] ? 1 : -1;
        }
        return a[sortField] < b[sortField] ? 1 : -1;
    });

    const handleSort = (field) => {
        if (field === sortField) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    const confirmDelete = (studentId) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#EF4444",
            cancelButtonColor: "#6B7280",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .delete(`/student/${studentId}`)
                    .then((response) => {
                        if (response.data.success) {
                            Swal.fire(
                                "Deleted!",
                                "Student has been deleted.",
                                "success"
                            );
                            // after success redirect to route student.index
                            window.location.reload()
                        }
                    })
                    .catch((error) => {
                        console.error("Error deleting student:", error);
                        Swal.fire(
                            "Error!",
                            "Failed to delete student.",
                            "error"
                        );
                    });
            }
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Students List
                    </h2>
                    <Link
                        href={route("student.create")}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                    >
                        Add New Student
                    </Link>
                </div>
            }
        >
            <Head title="Students" />

            <div className="py-12">
                <div className="max-w-[95%] mx-auto">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Search Bar */}
                            <div className="mb-4">
                                <input
                                    type="text"
                                    placeholder="Search by name or class..."
                                    className="w-full px-4 py-2 border rounded-md"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                />
                            </div>

                            {/* Students Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                                onClick={() =>
                                                    handleSort("photo_path")
                                                }
                                            >
                                                Photo
                                            </th>
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                                onClick={() =>
                                                    handleSort("child_name")
                                                }
                                            >
                                                Name
                                                {sortField === "child_name" && (
                                                    <span className="ml-1">
                                                        {sortDirection === "asc"
                                                            ? "↑"
                                                            : "↓"}
                                                    </span>
                                                )}
                                            </th>
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                                onClick={() =>
                                                    handleSort("class")
                                                }
                                            >
                                                Class
                                                {sortField === "class" && (
                                                    <span className="ml-1">
                                                        {sortDirection === "asc"
                                                            ? "↑"
                                                            : "↓"}
                                                    </span>
                                                )}
                                            </th>
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                                onClick={() =>
                                                    handleSort("date_of_birth")
                                                }
                                            >
                                                Date of Birth
                                                {sortField ===
                                                    "date_of_birth" && (
                                                    <span className="ml-1">
                                                        {sortDirection === "asc"
                                                            ? "↑"
                                                            : "↓"}
                                                    </span>
                                                )}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Address
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {sortedStudents.map((student) => (
                                            <tr key={student.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <img
                                                        src={`/storage/student-images/${student.photo_path}`}
                                                        alt={student.child_name}
                                                        className="h-10 w-10 rounded-full object-cover"
                                                    />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {student.child_name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {student.class}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {new Date(
                                                        student.date_of_birth
                                                    ).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {`${student.address}, ${student.city}, ${student.state}, ${student.country} ${student.zip_code}`}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex space-x-3">
                                                        <Link
                                                            href={`/view-student/${student.id}`}
                                                        >
                                                            <svg
                                                                className="w-5 h-5 text-blue-600 hover:text-blue-800"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                                />
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                                />
                                                            </svg>
                                                        </Link>
                                                        <Link
                                                            href={`/edit-student/${student.id}`}
                                                        >
                                                            <svg
                                                                className="w-5 h-5 text-yellow-600 hover:text-yellow-800"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                                />
                                                            </svg>
                                                        </Link>
                                                        <button
                                                            onClick={() =>
                                                                confirmDelete(
                                                                    student.id
                                                                )
                                                            }
                                                        >
                                                            <svg
                                                                className="w-5 h-5 text-red-600 hover:text-red-800"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                                />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="mt-4 flex items-center justify-between">
                                <div className="flex-1 flex justify-between sm:hidden">
                                    {students.prev_page_url && (
                                        <Link
                                            href={students.prev_page_url}
                                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                        >
                                            Previous
                                        </Link>
                                    )}
                                    {students.next_page_url && (
                                        <Link
                                            href={students.next_page_url}
                                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                        >
                                            Next
                                        </Link>
                                    )}
                                </div>
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            Showing{" "}
                                            <span className="font-medium">
                                                {students.from}
                                            </span>{" "}
                                            to{" "}
                                            <span className="font-medium">
                                                {students.to}
                                            </span>{" "}
                                            of{" "}
                                            <span className="font-medium">
                                                {students.total}
                                            </span>{" "}
                                            results
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                            {students.links.map(
                                                (link, index) => (
                                                    <Link
                                                        key={index}
                                                        href={link.url}
                                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium
                                                        ${
                                                            link.active
                                                                ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                                                                : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                                        }
                                                        ${
                                                            index === 0 &&
                                                            "rounded-l-md"
                                                        }
                                                        ${
                                                            index ===
                                                                students.links
                                                                    .length -
                                                                    1 &&
                                                            "rounded-r-md"
                                                        }
                                                    `}
                                                        dangerouslySetInnerHTML={{
                                                            __html: link.label,
                                                        }}
                                                    />
                                                )
                                            )}
                                        </nav>
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
