import React, { useState } from "react";
import dayjs from "dayjs";
import { v4 as uuid } from "uuid";
import "../static/Shift.css";

const formatDate = (dateString, t = false) => {
  const formattedDate = t
    ? dayjs(dateString).format("MMM DD, YYYY HH:mm")
    : dayjs(dateString).format("MMM DD, YYYY");
  return formattedDate;
};

const ShiftForm = ({
  handleAddNewShift,
  formData,
  handleFormDataChange,
  resetShiftFormData,
  shiftFormBtnText,
  updateShift,
}) => {
  const saveShift = () => {
    const newShift = { id: formData.id || uuid(), ...formData };
    if (shiftFormBtnText === "Add New Shift") {
      handleAddNewShift(newShift);
    } else {
      updateShift(newShift);
    }
    resetShiftFormData();
  };

  return (
    <div className="add-shift-form">
      <div>
        <input
          type="date"
          name="dateRecorded"
          id="js-date-recorded-inp"
          value={formData.dateRecorded}
          onChange={handleFormDataChange}
        />
      </div>
      <div>
        <input
          type="text"
          name="company"
          id="js-company-inp"
          value={formData.company}
          onChange={handleFormDataChange}
        />
      </div>
      <div>
        <input
          type="text"
          name="location"
          id="js-location-inp"
          value={formData.location}
          onChange={handleFormDataChange}
        />
      </div>
      <div>
        <input
          type="number"
          name="noOfHours"
          step="0.1"
          id="js-no-of-hours-inp"
          value={formData.noOfHours}
          onChange={handleFormDataChange}
        />
      </div>
      <div>
        <input
          type="datetime-local"
          name="startDate"
          id="js-start-date-inp"
          value={formData.startDate}
          onChange={handleFormDataChange}
        />
      </div>
      <div>
        <input
          type="datetime-local"
          name="endDate"
          id="js-end-date-inp"
          value={formData.endDate}
          onChange={handleFormDataChange}
        />
      </div>
      <div>
        <button type="button" onClick={saveShift}>
          {shiftFormBtnText}
        </button>
      </div>
    </div>
  );
};

const ShiftFilterForm = ({ filterShifts }) => {
  const [filterParams, setFilterParams] = useState({
    fromDate: new Date(),
    toDate: new Date(),
  });

  const processFilter = () => {
    const filteredShifts = filterShifts(filterParams);
    console.log(filteredShifts);
  };

  return (
    <>
      <h3>Filter Shift</h3>
      <div className="shift-filter-form">
        <div className="search-inputs">
          <div className="from-input">
            From:{" "}
            <input
              type="date"
              name="from-date"
              id="js-from-date"
              onChange={(e) =>
                setFilterParams({ ...filterParams, fromDate: e.target.value })
              }
            />
          </div>
          <div className="to-input">
            To:{" "}
            <input
              type="date"
              name="to-date"
              id="js-to-date"
              onChange={(e) =>
                setFilterParams({ ...filterParams, toDate: e.target.value })
              }
            />
          </div>
        </div>
        <button onClick={processFilter}>Filter</button>
      </div>
    </>
  );
};

const ShiftItemsHeader = () => {
  return (
    <div className="shift-items-header">
      <div>
        <h3>Date Recorded</h3>
      </div>
      <div>
        <h3>Company</h3>
      </div>
      <div>
        <h3>Address</h3>
      </div>
      <div>
        <h3>No. of Hours</h3>
      </div>
      <div>
        <h3>Start Time</h3>
      </div>
      <div>
        <h3>End Time</h3>
      </div>
      <div>&nbsp;</div>
    </div>
  );
};

const ShiftItem = ({ shift, deleteShift, editShift }) => {
  let t;
  return (
    <div className="shift-item">
      <div>{formatDate(shift.dateRecorded)}</div>
      <div>{shift.company}</div>
      <div>{shift.location}</div>
      <div>{shift.noOfHours}</div>
      <div>{formatDate(shift.startDate, (t = true))}</div>
      <div>{formatDate(shift.endDate, (t = true))}</div>
      <div className="action-buttons">
        <div className="edit-button">
          <button
            type="button"
            onClick={() => {
              editShift(shift);
            }}
          >
            Edit
          </button>
        </div>
        <div className="delete-button">
          <button
            type="button"
            onClick={() => {
              deleteShift(shift.id);
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const ShiftStatistics = ({ shifts }) => {
  let totalHours = 0;
  shifts.forEach((shift) => {
    totalHours += parseFloat(shift.noOfHours);
  });
  return (
    <div className="shift-statistics">
      <div className="no-of-shifts">
        <h3>No. of Shifts: {shifts.length}</h3>
      </div>
      <div className="total-shift-hours">
        <h3>Total Hours Worked: {totalHours}</h3>
      </div>
    </div>
  );
};

const ShiftItems = () => {
  const [formData, setFormData] = useState({
    dateRecorded: "",
    company: "",
    location: "",
    noOfHours: "",
    startDate: "",
    endDate: "",
  });

  const [shiftFormBtnText, setshiftFormBtnText] = useState("Add New Shift");

  const [shifts, setShifts] = useState(() => {
    return localStorage.getItem("shifts")
      ? JSON.parse(localStorage.getItem("shifts"))
      : [];
  });

  // this function is used to add a new shift
  const handleAddNewShift = (newShift) => {
    const startDate = newShift.startDate ? newShift.startDate : new Date();
    const endDate = newShift.endDate ? newShift.endDate : new Date();
    const shiftWithDate = {
      ...newShift,
      startDate: startDate,
      endDate: endDate,
    };
    const updatedShifts = [shiftWithDate, ...shifts];
    localStorage.setItem("shifts", JSON.stringify(updatedShifts));
    setShifts(updatedShifts);
  };

  // this function deletes a shift
  const handleDeleteShift = (shiftId) => {
    const updatedShifts = shifts.filter((shift) => shift.id !== shiftId);
    localStorage.setItem("shifts", JSON.stringify(updatedShifts));
    setShifts(updatedShifts);
    return updatedShifts;
  };

  const handleFormDataChange = (event) => {
    const { name, value } = event.target;
    setFormData((previousData) => ({ ...previousData, [name]: value }));
  };

  const resetShiftFormData = () => {
    setFormData({
      id: uuid(),
      dateRecorded: "",
      company: "",
      location: "",
      noOfHours: "",
      startDate: "",
      endDate: "",
    });
  };

  const updateShift = (updatedshift) => {
    const updatedShifts = shifts.map((shift) =>
      shift.id === updatedshift.id ? updatedshift : shift
    );
    // console.log(updatedShifts);

    localStorage.setItem("shifts", JSON.stringify(updatedShifts));
    setShifts(updatedShifts);
    setshiftFormBtnText("Add New Shift");
  };

  // this function edits a shift
  const handleEditShift = (shift) => {
    setFormData({
      ...shift,
    });
    setshiftFormBtnText("Update Shift");
  };

  const handleFilterShifts = (filterParams) => {
    const filteredShifts = shifts.filter(
      (shift) =>
        shift.dateRecorded >= filterParams.fromDate &&
        shift.dateRecorded <= filterParams.toDate
    );
    return filteredShifts;
  };

  return (
    <div className="shifts-container">
      <div className="add-shift">
        <ShiftForm
          handleAddNewShift={handleAddNewShift}
          formData={formData}
          handleFormDataChange={handleFormDataChange}
          resetShiftFormData={resetShiftFormData}
          shiftFormBtnText={shiftFormBtnText}
          updateShift={updateShift}
        />
      </div>
      <div className="shifts-list">
        <ShiftFilterForm filterShifts={handleFilterShifts} />
        <ShiftItemsHeader />
        {shifts.length > 0 ? (
          shifts.map((shift) => (
            <ShiftItem
              key={shift.id}
              shift={shift}
              deleteShift={handleDeleteShift}
              editShift={handleEditShift}
            />
          ))
        ) : (
          <div className="no-shifts">No Shifts recorded</div>
        )}
      </div>
      <div className="shifts-statistics-container">
        <ShiftStatistics shifts={shifts} />
      </div>
    </div>
  );
};

export default ShiftItems;
