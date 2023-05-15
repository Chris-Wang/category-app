function displayTable(data) {
  const tableData = {};

  const rowDepth = [];
  const depthTable = {
    1: ['Root'],
    2: ['Root', 'Level 2'],
    3: ['Root', 'Level 2', 'Level 3'],
    4: ['Root', 'Level 2', 'Level 3', 'Level 4'],
    5: ['Root', 'Level 2', 'Level 3', 'Level 4', 'Level 5'],
    6: ['Root', 'Level 2', 'Level 3', 'Level 4', 'Level 5', 'Level 6'],
  };
  data.categories[0].forEach((RootCategory) => {
    const rootName = RootCategory.name;
    const level2Categories = data.categories[1]
      .filter((c) => c.parent === RootCategory.id)
      .sort((a, b) => a.index - b.index);
    const rows = [];
    level2Categories.forEach((level2Category) => {
      const level3Categories = data.categories[2]
        .filter((c) => c.parent === level2Category.id)
        .sort((a, b) => a.index - b.index);
      level3Categories.forEach((level3Category) => {
        const level4Categories = data.categories[3]
          .filter((c) => c.parent === level3Category.id)
          .sort((a, b) => a.index - b.index);
        level4Categories.forEach((level4Category) => {
          const level5Categories = data.categories[4]
            .filter((c) => c.parent === level4Category.id)
            .sort((a, b) => a.index - b.index);
          level5Categories.forEach((level5Category) => {
            const level6Categories = data.categories[5]
              .filter((c) => c.parent === level5Category.id)
              .sort((a, b) => a.index - b.index);
            const level6Names = level6Categories.map((c) => c.name);
            if (level6Names.length !== 0) rowDepth.push(6);
            // Add rows for each level 6 category
            level6Names.forEach((level6Name) => {
              rows.push([
                rootName,
                level2Category.name,
                level3Category.name,
                level4Category.name,
                level5Category.name,
                level6Name,
              ]);
            });
            // Add a row for level 5 categories with no children categories
            if (level6Names.length === 0) {
              rows.push([
                rootName,
                level2Category.name,
                level3Category.name,
                level4Category.name,
                level5Category.name,
                '',
              ]);
              rowDepth.push(5);
            }
          });
          // Add a row for level 4 categories with no children categories
          if (level5Categories.length === 0) {
            rows.push([
              rootName,
              level2Category.name,
              level3Category.name,
              level4Category.name,
              '',
              '',
            ]);
            rowDepth.push(4);
          }
        });
        // Add a row for level 3 categories with no children categories
        if (level4Categories.length === 0) {
          rows.push([
            rootName,
            level2Category.name,
            level3Category.name,
            '',
            '',
            '',
          ]);
          rowDepth.push(3);
        }
      });
      // Add a row for level 2 categories with no children categories
      if (level3Categories.length === 0) {
        rows.push([rootName, level2Category.name, '', '', '', '']);
        rowDepth.push(2);
      }
    });
    // Add a row for root categories with no children categories
    if (level2Categories.length === 0) {
      rows.push([rootName, '', '', '', '', '']);
      rowDepth.push(1);
    }

    if (!tableData[rootName]) {
      tableData[rootName] = rows;
    } else {
      tableData[rootName] = tableData[rootName].concat(rows);
    }
  });

  const formattedTableData = [];
  for (const [rootName, rows] of Object.entries(tableData)) {
    if (rows.length === 0) {
      formattedTableData.push({
        Root: rootName,
        'Level 2': '',
        'Level 3': '',
        'Level 4': '',
        'Level 5': '',
        'Level 6': '',
      });
      continue;
    }
    for (const row of rows) {
      formattedTableData.push({
        Root: rootName,
        'Level 2': row[1],
        'Level 3': row[2],
        'Level 4': row[3],
        'Level 5': row[4],
        'Level 6': row[5],
      });
    }
  }

  // Print the table
  console.log('📦 Printing categories:');
  // console.log(tableData);
  console.table(formattedTableData, depthTable[Math.max(...rowDepth)]);
  console.table(data.categories.flat());
}

module.exports = {
  displayTable,
};
