// Define the function to be tested
const generateTrustLevelGraphData = (identitiesData, ruleData) => {
  let trustLevelData = [];
  let identityGroup = {};
  let ruleGroup = {};

  identityGroup = Object.values(
    identitiesData.reduce((r, a) => {
      r[a.trust_level] = r[a.trust_level] || {
        trustLevel: a.trust_level,
        count: 0,
      };
      r[a.trust_level].count++;
      return r;
    }, {}),
  );

  ruleGroup = Object.values(
    ruleData.reduce((r, a) => {
      r[a.trustLevel] = r[a.trustLevel] || {
        trustLevel: a.trustLevel,
        rulecount: 0,
      };
      r[a.trustLevel].rulecount++;
      return r;
    }, {}),
  );

  const trustIds = [
    ...new Set([
      ...identityGroup?.map((i) => i?.trustLevel),
      ...ruleGroup?.map((i) => i?.trustLevel),
    ]),
  ];
  trustIds.sort();

  trustLevelData = trustIds?.map((i) => ({
    rulecount: 0,
    count: 0,
    ...identityGroup?.find((f) => f?.trustLevel === i),
    ...ruleGroup?.find((f) => f?.trustLevel === i),
  }));

  const graphData = {
    labels: trustLevelData.map((val) => {
      return "Level " + val.trustLevel;
    }),
    datasets: [
      {
        label: "Sum of Identities",
        data: trustLevelData.map((val) => {
          return val.count;
        }),
        fill: false,
        elements: {
          line: {
            borderWidth: 1,
            backgroundColor: "#F5B31F",
            borderColor: "#F5B31F",
          },
          point: {
            radius: 6,
            hoverRadius: 4,
            backgroundColor: "rgba( 255, 255, 255, 1 )",
            borderColor: "#F5B31F",
          },
        },
      },
      {
        label: "Sum of Rules",
        data: trustLevelData.map((val) => {
          return val.rulecount;
        }),
        elements: {
          line: {
            borderWidth: 1,
            backgroundColor: "#8E5ED5",
            borderColor: "#8E5ED5",
          },
          point: {
            radius: 6,
            hoverRadius: 4,
            backgroundColor: "rgba( 255, 255, 255, 1 )",
            borderColor: "#8E5ED5",
          },
        },
      },
    ],
  };

  /* const graphData = {
    // labels: ["", "Level 3", ""],
    labels: ["Level 3"],
    datasets: [
      {
        label: "Sum of Identities",
        // data: [0, 43, 0],
        data: [43],
        fill: false,
        elements: {
          line: {
            borderWidth: 1,
            backgroundColor: "#F5B31F",
            borderColor: "#F5B31F",
          },
          point: {
            radius: 6,
            hoverRadius: 4,
            backgroundColor: "rgba( 255, 255, 255, 1 )",
            borderColor: "#F5B31F",
          },
        },
      },
      {
        label: "Sum of Rules",
        // data: [0, 13, 0],
        data: [13],
        elements: {
          line: {
            borderWidth: 1,
            backgroundColor: "#8E5ED5",
            borderColor: "#8E5ED5",
          },
          point: {
            radius: 6,
            hoverRadius: 4,
            backgroundColor: "rgba( 255, 255, 255, 1 )",
            borderColor: "#8E5ED5",
          },
        },
      },
    ],
  }; */

  return graphData;
}; // End of definition of function to be tested

// Test cases
const testCases = {
  "Identities with 6 TLs, Rules with 0 TLs, and 0 Common TLs": {
    input: [
      [
        {
          id: 1,
          name: "Identity 1",
          trust_level: 2,
        },
        {
          id: 2,
          name: "Identity 2",
          trust_level: 2,
        },
        {
          id: 3,
          name: "Identity 3",
          trust_level: 2,
        },
        {
          id: 4,
          name: "Identity 4",
          trust_level: 3,
        },
        {
          id: 5,
          name: "Identity 5",
          trust_level: 3,
        },
        {
          id: 6,
          name: "Identity 6",
          trust_level: 4,
        },
        {
          id: 7,
          name: "Identity 7",
          trust_level: 4,
        },
        {
          id: 8,
          name: "Identity 8",
          trust_level: 5,
        },
        {
          id: 9,
          name: "Identity 9",
          trust_level: 5,
        },
        {
          id: 10,
          name: "Identity 10",
          trust_level: 5,
        },
        {
          id: 11,
          name: "Identity 11",
          trust_level: 6,
        },
        {
          id: 12,
          name: "Identity 12",
          trust_level: 6,
        },
        {
          id: 13,
          name: "Identity 13",
          trust_level: 7,
        },
        {
          id: 14,
          name: "Identity 14",
          trust_level: 7,
        },
        {
          id: 15,
          name: "Identity 15",
          trust_level: 7,
        },
        {
          id: 16,
          name: "Identity 16",
          trust_level: 7,
        },
      ],
      [],
    ],
    expectedOutput: {
      labels: [
        "Level 2",
        "Level 3",
        "Level 4",
        "Level 5",
        "Level 6",
        "Level 7",
      ],
      datasets: [
        {
          label: "Sum of Identities",
          data: [3, 2, 2, 3, 2, 4],
          fill: false,
          elements: {
            line: {
              borderWidth: 1,
              backgroundColor: "#F5B31F",
              borderColor: "#F5B31F",
            },
            point: {
              radius: 6,
              hoverRadius: 4,
              backgroundColor: "rgba( 255, 255, 255, 1 )",
              borderColor: "#F5B31F",
            },
          },
        },
        {
          label: "Sum of Rules",
          data: [0, 0, 0, 0, 0, 0],
          elements: {
            line: {
              borderWidth: 1,
              backgroundColor: "#8E5ED5",
              borderColor: "#8E5ED5",
            },
            point: {
              radius: 6,
              hoverRadius: 4,
              backgroundColor: "rgba( 255, 255, 255, 1 )",
              borderColor: "#8E5ED5",
            },
          },
        },
      ],
    },
    expectedOutputIsJSON: true,
  }, // 6 ITLs, 0 RTLs, 0 Common
  "Identities with 4 TLs, Rules with 2 TLs, and 0 Common TLs": {
    input: [
      [
        {
          id: 1,
          name: "Identity 1",
          trust_level: 2,
        },
        {
          id: 2,
          name: "Identity 2",
          trust_level: 2,
        },
        {
          id: 3,
          name: "Identity 3",
          trust_level: 2,
        },
        {
          id: 4,
          name: "Identity 4",
          trust_level: 4,
        },
        {
          id: 5,
          name: "Identity 5",
          trust_level: 4,
        },
        {
          id: 6,
          name: "Identity 6",
          trust_level: 4,
        },
        {
          id: 7,
          name: "Identity 7",
          trust_level: 4,
        },
        {
          id: 8,
          name: "Identity 8",
          trust_level: 5,
        },
        {
          id: 9,
          name: "Identity 9",
          trust_level: 5,
        },
        {
          id: 10,
          name: "Identity 10",
          trust_level: 5,
        },
        {
          id: 11,
          name: "Identity 11",
          trust_level: 6,
        },
        {
          id: 12,
          name: "Identity 12",
          trust_level: 6,
        },
        {
          id: 13,
          name: "Identity 13",
          trust_level: 6,
        },
        {
          id: 14,
          name: "Identity 14",
          trust_level: 6,
        },
        {
          id: 15,
          name: "Identity 15",
          trust_level: 6,
        },
        {
          id: 16,
          name: "Identity 16",
          trust_level: 6,
        },
      ],
      [
        {
          id: 1,
          name: "Rule 1",
          trustLevel: 3,
        },
        {
          id: 2,
          name: "Rule 2",
          trustLevel: 3,
        },
        {
          id: 3,
          name: "Rule 3",
          trustLevel: 3,
        },
        {
          id: 4,
          name: "Rule 4",
          trustLevel: 3,
        },
        {
          id: 5,
          name: "Rule 5",
          trustLevel: 3,
        },
        {
          id: 6,
          name: "Rule 6",
          trustLevel: 3,
        },
        {
          id: 7,
          name: "Rule 7",
          trustLevel: 3,
        },
        {
          id: 8,
          name: "Rule 8",
          trustLevel: 7,
        },
        {
          id: 9,
          name: "Rule 9",
          trustLevel: 7,
        },
        {
          id: 10,
          name: "Rule 10",
          trustLevel: 7,
        },
        {
          id: 11,
          name: "Rule 11",
          trustLevel: 7,
        },
        {
          id: 12,
          name: "Rule 12",
          trustLevel: 7,
        },
        {
          id: 13,
          name: "Rule 13",
          trustLevel: 7,
        },
        {
          id: 14,
          name: "Rule 14",
          trustLevel: 7,
        },
        {
          id: 15,
          name: "Rule 15",
          trustLevel: 7,
        },
        {
          id: 16,
          name: "Rule 16",
          trustLevel: 7,
        },
      ],
    ],
    expectedOutput: {
      labels: [
        "Level 2",
        "Level 3",
        "Level 4",
        "Level 5",
        "Level 6",
        "Level 7",
      ],
      datasets: [
        {
          label: "Sum of Identities",
          data: [3, 0, 4, 3, 6, 0],
          fill: false,
          elements: {
            line: {
              borderWidth: 1,
              backgroundColor: "#F5B31F",
              borderColor: "#F5B31F",
            },
            point: {
              radius: 6,
              hoverRadius: 4,
              backgroundColor: "rgba( 255, 255, 255, 1 )",
              borderColor: "#F5B31F",
            },
          },
        },
        {
          label: "Sum of Rules",
          data: [0, 7, 0, 0, 0, 9],
          elements: {
            line: {
              borderWidth: 1,
              backgroundColor: "#8E5ED5",
              borderColor: "#8E5ED5",
            },
            point: {
              radius: 6,
              hoverRadius: 4,
              backgroundColor: "rgba( 255, 255, 255, 1 )",
              borderColor: "#8E5ED5",
            },
          },
        },
      ],
    },
    expectedOutputIsJSON: true,
  }, // 4 ITLs, 2 RTLs, 0 Common
  "Identities with 5 TLs, Rules with 3 TLs, and 1 Common TLs": {
    input: [
      [
        {
          id: 1,
          name: "Identity 1",
          trust_level: 2,
        },
        {
          id: 2,
          name: "Identity 2",
          trust_level: 2,
        },
        {
          id: 3,
          name: "Identity 3",
          trust_level: 2,
        },
        {
          id: 4,
          name: "Identity 4",
          trust_level: 3,
        },
        {
          id: 5,
          name: "Identity 5",
          trust_level: 3,
        },
        {
          id: 6,
          name: "Identity 6",
          trust_level: 4,
        },
        {
          id: 7,
          name: "Identity 7",
          trust_level: 4,
        },
        {
          id: 8,
          name: "Identity 8",
          trust_level: 5,
        },
        {
          id: 9,
          name: "Identity 9",
          trust_level: 5,
        },
        {
          id: 10,
          name: "Identity 10",
          trust_level: 5,
        },
        {
          id: 11,
          name: "Identity 11",
          trust_level: 6,
        },
        {
          id: 12,
          name: "Identity 12",
          trust_level: 6,
        },
        {
          id: 13,
          name: "Identity 13",
          trust_level: 6,
        },
        {
          id: 14,
          name: "Identity 14",
          trust_level: 6,
        },
        {
          id: 15,
          name: "Identity 15",
          trust_level: 6,
        },
        {
          id: 16,
          name: "Identity 16",
          trust_level: 6,
        },
      ],
      [
        {
          id: 1,
          name: "Rule 1",
          trustLevel: 3,
        },
        {
          id: 2,
          name: "Rule 2",
          trustLevel: 3,
        },
        {
          id: 3,
          name: "Rule 3",
          trustLevel: 3,
        },
        {
          id: 4,
          name: "Rule 4",
          trustLevel: 3,
        },
        {
          id: 5,
          name: "Rule 5",
          trustLevel: 3,
        },
        {
          id: 6,
          name: "Rule 6",
          trustLevel: 4,
        },
        {
          id: 7,
          name: "Rule 7",
          trustLevel: 4,
        },
        {
          id: 8,
          name: "Rule 8",
          trustLevel: 4,
        },
        {
          id: 9,
          name: "Rule 9",
          trustLevel: 4,
        },
        {
          id: 10,
          name: "Rule 10",
          trustLevel: 4,
        },
        {
          id: 11,
          name: "Rule 11",
          trustLevel: 7,
        },
        {
          id: 12,
          name: "Rule 12",
          trustLevel: 7,
        },
        {
          id: 13,
          name: "Rule 13",
          trustLevel: 7,
        },
        {
          id: 14,
          name: "Rule 14",
          trustLevel: 7,
        },
        {
          id: 15,
          name: "Rule 15",
          trustLevel: 7,
        },
        {
          id: 16,
          name: "Rule 16",
          trustLevel: 7,
        },
      ],
    ],
    expectedOutput: {
      labels: [
        "Level 2",
        "Level 3",
        "Level 4",
        "Level 5",
        "Level 6",
        "Level 7",
      ],
      datasets: [
        {
          label: "Sum of Identities",
          data: [3, 2, 2, 3, 6, 0],
          fill: false,
          elements: {
            line: {
              borderWidth: 1,
              backgroundColor: "#F5B31F",
              borderColor: "#F5B31F",
            },
            point: {
              radius: 6,
              hoverRadius: 4,
              backgroundColor: "rgba( 255, 255, 255, 1 )",
              borderColor: "#F5B31F",
            },
          },
        },
        {
          label: "Sum of Rules",
          data: [0, 5, 5, 0, 0, 6],
          elements: {
            line: {
              borderWidth: 1,
              backgroundColor: "#8E5ED5",
              borderColor: "#8E5ED5",
            },
            point: {
              radius: 6,
              hoverRadius: 4,
              backgroundColor: "rgba( 255, 255, 255, 1 )",
              borderColor: "#8E5ED5",
            },
          },
        },
      ],
    },
    expectedOutputIsJSON: true,
  }, // 5 ITLs, 3 RTLs, 1 Common
  "Identities with 6 TLs, Rules with 4 TLs, and 3 Common TLs": {
    input: [
      [
        {
          id: 1,
          name: "Identity 1",
          trust_level: 2,
        },
        {
          id: 2,
          name: "Identity 2",
          trust_level: 2,
        },
        {
          id: 3,
          name: "Identity 3",
          trust_level: 2,
        },
        {
          id: 4,
          name: "Identity 4",
          trust_level: 3,
        },
        {
          id: 5,
          name: "Identity 5",
          trust_level: 3,
        },
        {
          id: 6,
          name: "Identity 6",
          trust_level: 4,
        },
        {
          id: 7,
          name: "Identity 7",
          trust_level: 4,
        },
        {
          id: 8,
          name: "Identity 8",
          trust_level: 5,
        },
        {
          id: 9,
          name: "Identity 9",
          trust_level: 5,
        },
        {
          id: 10,
          name: "Identity 10",
          trust_level: 5,
        },
        {
          id: 11,
          name: "Identity 11",
          trust_level: 6,
        },
        {
          id: 12,
          name: "Identity 12",
          trust_level: 6,
        },
        {
          id: 13,
          name: "Identity 13",
          trust_level: 6,
        },
        {
          id: 14,
          name: "Identity 14",
          trust_level: 7,
        },
        {
          id: 15,
          name: "Identity 15",
          trust_level: 7,
        },
        {
          id: 16,
          name: "Identity 16",
          trust_level: 7,
        },
      ],
      [
        {
          id: 1,
          name: "Rule 1",
          trustLevel: 3,
        },
        {
          id: 2,
          name: "Rule 2",
          trustLevel: 3,
        },
        {
          id: 3,
          name: "Rule 3",
          trustLevel: 3,
        },
        {
          id: 4,
          name: "Rule 4",
          trustLevel: 3,
        },
        {
          id: 5,
          name: "Rule 5",
          trustLevel: 3,
        },
        {
          id: 6,
          name: "Rule 6",
          trustLevel: 4,
        },
        {
          id: 7,
          name: "Rule 7",
          trustLevel: 4,
        },
        {
          id: 8,
          name: "Rule 8",
          trustLevel: 4,
        },
        {
          id: 9,
          name: "Rule 9",
          trustLevel: 5,
        },
        {
          id: 10,
          name: "Rule 10",
          trustLevel: 5,
        },
        {
          id: 11,
          name: "Rule 11",
          trustLevel: 5,
        },
        {
          id: 12,
          name: "Rule 12",
          trustLevel: 7,
        },
        {
          id: 13,
          name: "Rule 13",
          trustLevel: 7,
        },
        {
          id: 14,
          name: "Rule 14",
          trustLevel: 7,
        },
        {
          id: 15,
          name: "Rule 15",
          trustLevel: 7,
        },
        {
          id: 16,
          name: "Rule 16",
          trustLevel: 7,
        },
      ],
    ],
    expectedOutput: {
      labels: [
        "Level 2",
        "Level 3",
        "Level 4",
        "Level 5",
        "Level 6",
        "Level 7",
      ],
      datasets: [
        {
          label: "Sum of Identities",
          data: [3, 2, 2, 3, 3, 3],
          fill: false,
          elements: {
            line: {
              borderWidth: 1,
              backgroundColor: "#F5B31F",
              borderColor: "#F5B31F",
            },
            point: {
              radius: 6,
              hoverRadius: 4,
              backgroundColor: "rgba( 255, 255, 255, 1 )",
              borderColor: "#F5B31F",
            },
          },
        },
        {
          label: "Sum of Rules",
          data: [0, 5, 3, 3, 0, 5],
          elements: {
            line: {
              borderWidth: 1,
              backgroundColor: "#8E5ED5",
              borderColor: "#8E5ED5",
            },
            point: {
              radius: 6,
              hoverRadius: 4,
              backgroundColor: "rgba( 255, 255, 255, 1 )",
              borderColor: "#8E5ED5",
            },
          },
        },
      ],
    },
    expectedOutputIsJSON: true,
  }, // 6 ITLs, 4 RTLs, 3 Common
  "Identities with 4 TLs, Rules with 6 TLs, and 3 Common TLs": {
    input: [
      [
        {
          id: 1,
          name: "Identity 1",
          trust_level: 3,
        },
        {
          id: 2,
          name: "Identity 2",
          trust_level: 3,
        },
        {
          id: 3,
          name: "Identity 3",
          trust_level: 3,
        },
        {
          id: 4,
          name: "Identity 4",
          trust_level: 3,
        },
        {
          id: 5,
          name: "Identity 5",
          trust_level: 3,
        },
        {
          id: 6,
          name: "Identity 6",
          trust_level: 4,
        },
        {
          id: 7,
          name: "Identity 7",
          trust_level: 4,
        },
        {
          id: 8,
          name: "Identity 8",
          trust_level: 4,
        },
        {
          id: 9,
          name: "Identity 9",
          trust_level: 5,
        },
        {
          id: 10,
          name: "Identity 10",
          trust_level: 5,
        },
        {
          id: 11,
          name: "Identity 11",
          trust_level: 5,
        },
        {
          id: 12,
          name: "Identity 12",
          trust_level: 7,
        },
        {
          id: 13,
          name: "Identity 13",
          trust_level: 7,
        },
        {
          id: 14,
          name: "Identity 14",
          trust_level: 7,
        },
        {
          id: 15,
          name: "Identity 15",
          trust_level: 7,
        },
        {
          id: 16,
          name: "Identity 16",
          trust_level: 7,
        },
      ],
      [
        {
          id: 1,
          name: "Rule 1",
          trustLevel: 2,
        },
        {
          id: 2,
          name: "Rule 2",
          trustLevel: 2,
        },
        {
          id: 3,
          name: "Rule 3",
          trustLevel: 2,
        },
        {
          id: 4,
          name: "Rule 4",
          trustLevel: 3,
        },
        {
          id: 5,
          name: "Rule 5",
          trustLevel: 3,
        },
        {
          id: 6,
          name: "Rule 6",
          trustLevel: 4,
        },
        {
          id: 7,
          name: "Rule 7",
          trustLevel: 4,
        },
        {
          id: 8,
          name: "Rule 8",
          trustLevel: 5,
        },
        {
          id: 9,
          name: "Rule 9",
          trustLevel: 5,
        },
        {
          id: 10,
          name: "Rule 10",
          trustLevel: 5,
        },
        {
          id: 11,
          name: "Rule 11",
          trustLevel: 6,
        },
        {
          id: 12,
          name: "Rule 12",
          trustLevel: 6,
        },
        {
          id: 13,
          name: "Rule 13",
          trustLevel: 6,
        },
        {
          id: 14,
          name: "Rule 14",
          trustLevel: 7,
        },
        {
          id: 15,
          name: "Rule 15",
          trustLevel: 7,
        },
        {
          id: 16,
          name: "Rule 16",
          trustLevel: 7,
        },
      ],
    ],
    expectedOutput: {
      labels: [
        "Level 2",
        "Level 3",
        "Level 4",
        "Level 5",
        "Level 6",
        "Level 7",
      ],
      datasets: [
        {
          label: "Sum of Identities",
          data: [0, 5, 3, 3, 0, 5],
          fill: false,
          elements: {
            line: {
              borderWidth: 1,
              backgroundColor: "#F5B31F",
              borderColor: "#F5B31F",
            },
            point: {
              radius: 6,
              hoverRadius: 4,
              backgroundColor: "rgba( 255, 255, 255, 1 )",
              borderColor: "#F5B31F",
            },
          },
        },
        {
          label: "Sum of Rules",
          data: [3, 2, 2, 3, 3, 3],
          elements: {
            line: {
              borderWidth: 1,
              backgroundColor: "#8E5ED5",
              borderColor: "#8E5ED5",
            },
            point: {
              radius: 6,
              hoverRadius: 4,
              backgroundColor: "rgba( 255, 255, 255, 1 )",
              borderColor: "#8E5ED5",
            },
          },
        },
      ],
    },
    expectedOutputIsJSON: true,
  }, // 4 ITLs, 6 RTLs, 3 Common
  "Identities with 3 TLs, Rules with 5 TLs, and 1 Common TLs": {
    input: [
      [
        {
          id: 1,
          name: "Identity 1",
          trust_level: 3,
        },
        {
          id: 2,
          name: "Identity 2",
          trust_level: 3,
        },
        {
          id: 3,
          name: "Identity 3",
          trust_level: 3,
        },
        {
          id: 4,
          name: "Identity 4",
          trust_level: 3,
        },
        {
          id: 5,
          name: "Identity 5",
          trust_level: 3,
        },
        {
          id: 6,
          name: "Identity 6",
          trust_level: 4,
        },
        {
          id: 7,
          name: "Identity 7",
          trust_level: 4,
        },
        {
          id: 8,
          name: "Identity 8",
          trust_level: 4,
        },
        {
          id: 9,
          name: "Identity 9",
          trust_level: 4,
        },
        {
          id: 10,
          name: "Identity 10",
          trust_level: 4,
        },
        {
          id: 11,
          name: "Identity 11",
          trust_level: 7,
        },
        {
          id: 12,
          name: "Identity 12",
          trust_level: 7,
        },
        {
          id: 13,
          name: "Identity 13",
          trust_level: 7,
        },
        {
          id: 14,
          name: "Identity 14",
          trust_level: 7,
        },
        {
          id: 15,
          name: "Identity 15",
          trust_level: 7,
        },
        {
          id: 16,
          name: "Identity 16",
          trust_level: 7,
        },
      ],
      [
        {
          id: 1,
          name: "Rule 1",
          trustLevel: 2,
        },
        {
          id: 2,
          name: "Rule 2",
          trustLevel: 2,
        },
        {
          id: 3,
          name: "Rule 3",
          trustLevel: 2,
        },
        {
          id: 4,
          name: "Rule 4",
          trustLevel: 3,
        },
        {
          id: 5,
          name: "Rule 5",
          trustLevel: 3,
        },
        {
          id: 6,
          name: "Rule 6",
          trustLevel: 4,
        },
        {
          id: 7,
          name: "Rule 7",
          trustLevel: 4,
        },
        {
          id: 8,
          name: "Rule 8",
          trustLevel: 5,
        },
        {
          id: 9,
          name: "Rule 9",
          trustLevel: 5,
        },
        {
          id: 10,
          name: "Rule 10",
          trustLevel: 5,
        },
        {
          id: 11,
          name: "Rule 11",
          trustLevel: 6,
        },
        {
          id: 12,
          name: "Rule 12",
          trustLevel: 6,
        },
        {
          id: 13,
          name: "Rule 13",
          trustLevel: 6,
        },
        {
          id: 14,
          name: "Rule 14",
          trustLevel: 6,
        },
        {
          id: 15,
          name: "Rule 15",
          trustLevel: 6,
        },
        {
          id: 16,
          name: "Rule 16",
          trustLevel: 6,
        },
      ],
    ],
    expectedOutput: {
      labels: [
        "Level 2",
        "Level 3",
        "Level 4",
        "Level 5",
        "Level 6",
        "Level 7",
      ],
      datasets: [
        {
          label: "Sum of Identities",
          data: [0, 5, 5, 0, 0, 6],
          fill: false,
          elements: {
            line: {
              borderWidth: 1,
              backgroundColor: "#F5B31F",
              borderColor: "#F5B31F",
            },
            point: {
              radius: 6,
              hoverRadius: 4,
              backgroundColor: "rgba( 255, 255, 255, 1 )",
              borderColor: "#F5B31F",
            },
          },
        },
        {
          label: "Sum of Rules",
          data: [3, 2, 2, 3, 6, 0],
          elements: {
            line: {
              borderWidth: 1,
              backgroundColor: "#8E5ED5",
              borderColor: "#8E5ED5",
            },
            point: {
              radius: 6,
              hoverRadius: 4,
              backgroundColor: "rgba( 255, 255, 255, 1 )",
              borderColor: "#8E5ED5",
            },
          },
        },
      ],
    },
    expectedOutputIsJSON: true,
  }, // 3 ITLs, 5 RTLs, 1 Common
  "Identities with 2 TLs, Rules with 4 TLs, and 0 Common TLs": {
    input: [
      [
        {
          id: 1,
          name: "Identity 1",
          trust_level: 3,
        },
        {
          id: 2,
          name: "Identity 2",
          trust_level: 3,
        },
        {
          id: 3,
          name: "Identity 3",
          trust_level: 3,
        },
        {
          id: 4,
          name: "Identity 4",
          trust_level: 3,
        },
        {
          id: 5,
          name: "Identity 5",
          trust_level: 3,
        },
        {
          id: 6,
          name: "Identity 6",
          trust_level: 3,
        },
        {
          id: 7,
          name: "Identity 7",
          trust_level: 3,
        },
        {
          id: 8,
          name: "Identity 8",
          trust_level: 7,
        },
        {
          id: 9,
          name: "Identity 9",
          trust_level: 7,
        },
        {
          id: 10,
          name: "Identity 10",
          trust_level: 7,
        },
        {
          id: 11,
          name: "Identity 11",
          trust_level: 7,
        },
        {
          id: 12,
          name: "Identity 12",
          trust_level: 7,
        },
        {
          id: 13,
          name: "Identity 13",
          trust_level: 7,
        },
        {
          id: 14,
          name: "Identity 14",
          trust_level: 7,
        },
        {
          id: 15,
          name: "Identity 15",
          trust_level: 7,
        },
        {
          id: 16,
          name: "Identity 16",
          trust_level: 7,
        },
      ],
      [
        {
          id: 1,
          name: "Rule 1",
          trustLevel: 2,
        },
        {
          id: 2,
          name: "Rule 2",
          trustLevel: 2,
        },
        {
          id: 3,
          name: "Rule 3",
          trustLevel: 2,
        },
        {
          id: 4,
          name: "Rule 4",
          trustLevel: 4,
        },
        {
          id: 5,
          name: "Rule 5",
          trustLevel: 4,
        },
        {
          id: 6,
          name: "Rule 6",
          trustLevel: 4,
        },
        {
          id: 7,
          name: "Rule 7",
          trustLevel: 4,
        },
        {
          id: 8,
          name: "Rule 8",
          trustLevel: 5,
        },
        {
          id: 9,
          name: "Rule 9",
          trustLevel: 5,
        },
        {
          id: 10,
          name: "Rule 10",
          trustLevel: 5,
        },
        {
          id: 11,
          name: "Rule 11",
          trustLevel: 6,
        },
        {
          id: 12,
          name: "Rule 12",
          trustLevel: 6,
        },
        {
          id: 13,
          name: "Rule 13",
          trustLevel: 6,
        },
        {
          id: 14,
          name: "Rule 14",
          trustLevel: 6,
        },
        {
          id: 15,
          name: "Rule 15",
          trustLevel: 6,
        },
        {
          id: 16,
          name: "Rule 16",
          trustLevel: 6,
        },
      ],
    ],
    expectedOutput: {
      labels: [
        "Level 2",
        "Level 3",
        "Level 4",
        "Level 5",
        "Level 6",
        "Level 7",
      ],
      datasets: [
        {
          label: "Sum of Identities",
          data: [0, 7, 0, 0, 0, 9],
          fill: false,
          elements: {
            line: {
              borderWidth: 1,
              backgroundColor: "#F5B31F",
              borderColor: "#F5B31F",
            },
            point: {
              radius: 6,
              hoverRadius: 4,
              backgroundColor: "rgba( 255, 255, 255, 1 )",
              borderColor: "#F5B31F",
            },
          },
        },
        {
          label: "Sum of Rules",
          data: [3, 0, 4, 3, 6, 0],
          elements: {
            line: {
              borderWidth: 1,
              backgroundColor: "#8E5ED5",
              borderColor: "#8E5ED5",
            },
            point: {
              radius: 6,
              hoverRadius: 4,
              backgroundColor: "rgba( 255, 255, 255, 1 )",
              borderColor: "#8E5ED5",
            },
          },
        },
      ],
    },
    expectedOutputIsJSON: true,
  }, // 2 ITLs, 4 RTLs, 0 Common
  "Identities with 0 TLs, Rules with 6 TLs, and 0 Common TLs": {
    input: [
      [],
      [
        {
          id: 1,
          name: "Rule 1",
          trustLevel: 2,
        },
        {
          id: 2,
          name: "Rule 2",
          trustLevel: 2,
        },
        {
          id: 3,
          name: "Rule 3",
          trustLevel: 2,
        },
        {
          id: 4,
          name: "Rule 4",
          trustLevel: 3,
        },
        {
          id: 5,
          name: "Rule 5",
          trustLevel: 3,
        },
        {
          id: 6,
          name: "Rule 6",
          trustLevel: 4,
        },
        {
          id: 7,
          name: "Rule 7",
          trustLevel: 4,
        },
        {
          id: 8,
          name: "Rule 8",
          trustLevel: 5,
        },
        {
          id: 9,
          name: "Rule 9",
          trustLevel: 5,
        },
        {
          id: 10,
          name: "Rule 10",
          trustLevel: 5,
        },
        {
          id: 11,
          name: "Rule 11",
          trustLevel: 6,
        },
        {
          id: 12,
          name: "Rule 12",
          trustLevel: 6,
        },
        {
          id: 13,
          name: "Rule 13",
          trustLevel: 7,
        },
        {
          id: 14,
          name: "Rule 14",
          trustLevel: 7,
        },
        {
          id: 15,
          name: "Rule 15",
          trustLevel: 7,
        },
        {
          id: 16,
          name: "Rule 16",
          trustLevel: 7,
        },
      ],
    ],
    expectedOutput: {
      labels: [
        "Level 2",
        "Level 3",
        "Level 4",
        "Level 5",
        "Level 6",
        "Level 7",
      ],
      datasets: [
        {
          label: "Sum of Identities",
          data: [0, 0, 0, 0, 0, 0],
          fill: false,
          elements: {
            line: {
              borderWidth: 1,
              backgroundColor: "#F5B31F",
              borderColor: "#F5B31F",
            },
            point: {
              radius: 6,
              hoverRadius: 4,
              backgroundColor: "rgba( 255, 255, 255, 1 )",
              borderColor: "#F5B31F",
            },
          },
        },
        {
          label: "Sum of Rules",
          data: [3, 2, 2, 3, 2, 4],
          elements: {
            line: {
              borderWidth: 1,
              backgroundColor: "#8E5ED5",
              borderColor: "#8E5ED5",
            },
            point: {
              radius: 6,
              hoverRadius: 4,
              backgroundColor: "rgba( 255, 255, 255, 1 )",
              borderColor: "#8E5ED5",
            },
          },
        },
      ],
    },
    expectedOutputIsJSON: true,
  }, // 0 ITLs, 6 RTLs, 0 Common
  // 1 ITL, 0 RTLs, 0 Common
  // 0 ITLs, 1 RTL, 0 Common
}; // End of test cases to be tested with the test function

// Test configuration
const testFunc = generateTrustLevelGraphData;
const testName = "Generate Trust Level Graph Data";

// Running the test

let testCaseCount = 1;
let testCasesPassed = 0;
let testCasesFailed = 0;
Object.keys(testCases).forEach((caseName) => {
  let output = testFunc(...testCases[caseName].input);
  let result = testCases[caseName].expectedOutputIsJSON
    ? JSON.stringify(output) ===
      JSON.stringify(testCases[caseName].expectedOutput)
    : output === testCases[caseName].expectedOutput;
  if (result) {
    testCasesPassed += 1;
  } else {
    testCasesFailed += 1;
  }

  testCaseCount += 1;
});
