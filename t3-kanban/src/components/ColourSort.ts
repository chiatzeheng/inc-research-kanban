const getColumnColors = (lastColourColumn?: Column): Column => {
  const columnColors: string[] = [
    "bg-teal-100",
    "bg-pink-100",
    "bg-amber-100",
    "bg-blue-100",
    "bg-yellow-100",
    "bg-green-100",
    "bg-indigo-100",
    "bg-purple-100",
    "bg-red-100",
  ];

  const columnTextColors: string[] = [
    "text-teal-800",
    "text-pink-800",
    "text-amber-800",
    "text-blue-800",
    "text-yellow-800",
    "text-green-800",
    "text-indigo-800",
    "text-purple-800",
    "text-red-800",
  ];
  //makes sure last column colour is not repeated
  if (lastColourColumn) {
    const lastColorIndex = columnColors.indexOf(lastColourColumn.color);
    if (lastColorIndex !== -1) {
      columnColors.splice(lastColorIndex, 1);
      columnTextColors.splice(lastColorIndex, 1);
    }
  }

  const colorIndex: number = Math.floor(Math.random() * columnColors.length);

  let ColumnColour: Column = {
    id: "",
    title: "",
    color: columnColors[colorIndex] || "",
    textColor: columnTextColors[colorIndex] || "",
  };

  //   let styling: string = columnColors[colorIndex] || "";
  return ColumnColour;
};
