import React, { useState } from "react";
import Ellipsis from "../icons/View";

const PredictSize = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);

  const toggleDialog = () => {
    setIsDialogOpen(!isDialogOpen);
  };

  const handleUploadButtonClick = () => {
    setIsDialogOpen(true);
  };

  const handlePredictData = (event) => {
    event.preventDefault();

    setIsLoading(true);

    const formData = new FormData(event.target);
    const weight = formData.get("weight");
    const height = formData.get("height");
    const age = formData.get("age");

    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ weight, height, age }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setPredictionResult(data);
        console.log(data); // Log the JSON response
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });

    event.target.reset(); // Consider resetting the form only on successful submission
  };

  return (
    <div>
      <section className="grid md:grid-cols-2 grid-cols-1 gap-4">
        <div
          onClick={handleUploadButtonClick}
          className="flex flex-col gap-y-3 bg-blue-50 p-5 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors duration-300"
          style={{ boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)" }}
        >
          <Ellipsis className="text-blue-400" />
          <article className="flex flex-col gap-y-0.5">
            <h2 className="text-lg font-semibold">Upload your Size</h2>
            <p className="text-sm text-gray-600">
              You can simply click and fill out a form with your details
            </p>
          </article>
        </div>
      </section>
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg shadow-lg">
            <button
              className="mb-4 p-1 bg-black hover:bg-black/90 text-white rounded flex items-center justify-center"
              aria-label="Close"
              onClick={() => setIsDialogOpen(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
            <form
              className="w-full flex flex-col gap-y-4"
              encType="multipart/form-data"
              onSubmit={handlePredictData}
            >
              <div className="w-full flex flex-row gap-x-4">
                <div className="w-full flex flex-col gap-y-4 p-4 border rounded">
                  <label htmlFor="age" className="w-full flex flex-col gap-y-1">
                    <span className="text-sm">Your age*</span>
                    <input type="text" name="age" id="age" required />
                  </label>
                  <label
                    htmlFor="height"
                    className="w-full flex flex-col gap-y-1"
                  >
                    <span className="text-sm">Your height*</span>
                    <input type="text" name="height" id="height" required />
                  </label>
                  <label
                    htmlFor="weight"
                    className="w-full flex flex-col gap-y-1"
                  >
                    <span className="text-sm">Your weight*</span>
                    <input type="text" name="weight" id="weight" required />
                  </label>
                </div>
              </div>
              <input
                type="submit"
                value="Submit"
                className="py-2 border border-black rounded bg-black hover:bg-black/90 text-white transition-colors drop-shadow cursor-pointer"
              />
            </form>
            {isLoading && <div>Loading...</div>}
            {predictionResult && (
              <div className="mt-4">
                <h2 className="text-lg font-semibold">Prediction Result:</h2>
                <table className="table-auto">
                  <tbody>
                    {Object.entries(predictionResult).map(([key, value]) => (
                      <tr key={key}>
                        <td className="border px-4 py-2">
                          {key.replace(/_/g, " ")}
                        </td>
                        <td className="border px-4 py-2">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictSize;
