export default function Mensaje({ desciption }) {
    return (
        <div className="p-6 bg-gray-50 min-h-screen flex  justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">{desciption}</p>
            </div>
        </div>
    );

}