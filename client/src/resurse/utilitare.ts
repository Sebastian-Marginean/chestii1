export const dataGridNumeClase = "border border-gray-200 bg-white shadow";

export const dataGridStiluriSx = () => {
  return {
    "& .MuiDataGrid-root": {
      backgroundColor: "white", // fundal general grid
      color: "#1a1740",
    },
    "& .MuiDataGrid-columnHeaders": {
      color: "#1a1740",
      '& [role="row"] > *': {
        backgroundColor: "white",
        borderColor: "#e5e7eb",
      },
    },
    "& .MuiIconbutton-root": {
      color: "#1a1740",
      backgroundColor: "white",
    },
    "& .MuiTablePagination-root": {
      color: "#1a1740",
      backgroundColor: "white",
    },
    "& .MuiTablePagination-selectIcon": {
      color: "#1a1740",
      backgroundColor: "white",
    },
    "& .MuiDataGrid-cell": {
      backgroundColor: "white",
    },
    "& .MuiDataGrid-row": {
      borderBottom: "1px solid #e5e7eb",
      backgroundColor: "white",
    },
    "& .MuiDataGrid-withBorderColor": {
      borderColor: "#e5e7eb",
      backgroundColor: "white",
    },
    "& .MuiDataGrid-filler": {
      borderColor: "#e5e7eb",
      backgroundColor: "white",
    },
  };
};
