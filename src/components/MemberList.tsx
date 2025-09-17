import { useEffect, useState } from "react";
import axios from "axios";
import type { Member } from "../types/Member";

function MemberList() {
  const [members, setMembers] = useState<Member[]>([]);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editedMember, setEditedMember] = useState<Partial<Member>>({});

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = () => {
    axios
      .get<Member[]>("http://localhost:8080/members")
      .then((response) => setMembers(response.data))
      .catch((error) => console.error("Error fetching members:", error));
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to remove this member?")) {
      axios
        .delete(`http://localhost:8080/members/${id}`)
        .then(() => {
          alert("Member removed successfully!");
          fetchMembers();
        })
        .catch((error) => console.error("Error removing member:", error));
    }
  };

  const handleEditClick = (member: Member) => {
    setIsEditing(member.id);
    setEditedMember(member); // keep the existing registrationDate unchanged
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setEditedMember({
      ...editedMember,
      [name]: type === "number" ? Number(value) : value,
    });
  };

  const handleReload = () => {
    fetchMembers();
  };

  const handleSaveEdit = (id: number) => {
    axios
      .put(`http://localhost:8080/members/${id}`, editedMember)
      .then(() => {
        alert("Member updated successfully!");
        setIsEditing(null);
        fetchMembers();
      })
      .catch((error) => console.error("Error updating member:", error));
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Member List</h2>
        <button className="btn btn-primary btn-sm me-2" onClick={handleReload}>
          Reload
        </button>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Registration Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id}>
              {isEditing === member.id ? (
                <>
                  <td>
                    <input
                      type="text"
                      name="name"
                      value={editedMember.name || ""}
                      onChange={handleEditChange}
                      className="form-control"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="email"
                      value={editedMember.email || ""}
                      onChange={handleEditChange}
                      className="form-control"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="phone"
                      value={editedMember.phone || ""}
                      onChange={handleEditChange}
                      className="form-control"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="address"
                      value={editedMember.address || ""}
                      onChange={handleEditChange}
                      className="form-control"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      value={
                        editedMember.registrationDate
                          ? new Date(editedMember.registrationDate).toLocaleDateString()
                          : "N/A"
                      }
                      disabled
                      readOnly
                    />
                  </td>
                  <td>
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => handleSaveEdit(member.id)}
                    >
                      Save
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setIsEditing(null)}
                    >
                      Cancel
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td>{member.name}</td>
                  <td>{member.email}</td>
                  <td>{member.phone}</td>
                  <td>{member.address}</td>
                  <td>
                    {member.registrationDate
                      ? new Date(member.registrationDate).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => handleEditClick(member)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(member.id)}
                    >
                      Delete
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MemberList;