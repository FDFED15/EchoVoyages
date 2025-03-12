import React from "react";
import { Link } from "react-router-dom";

const PackagesTable = ({ packages }) => {
  const now = new Date();
  const packsLast24Hours = packages.filter((user) => {
    const agentCreatedAt = new Date(user.createdAt);
    return now - agentCreatedAt < 24 * 60 * 60 * 1000;
  });

  return (
    <div>
      <div className="m-4 text-xl">
        Packages added in the last 24 hours: {packsLast24Hours.length}
      </div>
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>No</th>
              <th>Package Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((pkg, index) => (
              <tr key={pkg._id}>
                <td>{index + 1}</td>
                <td>{pkg.name}</td>
                <td>{pkg.description}</td>
                <td>{pkg.price}</td>
                <td>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Link 
                      className="btn btn-neutral btn-xs" 
                      to={`/admin/packages/${pkg._id}`}
                    >
                      Show
                    </Link>
                    <Link 
                      className="btn btn-dark btn-xs" 
                      to={`/admin/packages/edit/${pkg._id}`}
                    >
                      Update
                    </Link>
                    <Link 
                      className="btn btn-error btn-xs" 
                      to={`/admin/packages/delete/${pkg._id}`}
                    >
                      Delete
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PackagesTable;