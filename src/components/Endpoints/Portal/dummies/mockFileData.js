const mockFileData = `
{
  "id" : 22,
  "trIp" : "10.0.20.22/24",
  "trVlanId" : 121,
  "utIp" : "10.0.40.21/24",
  "utVlanId" : 221,
  "tr_prefix" : 24,
  "ut_prefix" : 24,
  "gatewayIP" : null
}, {
  "id" : 22,
  "trIp" : "10.0.20.22/24",
  "trVlanId" : 122,
  "utIp" : "10.0.40.22/24",
  "utVlanId" : 222,
  "tr_prefix" : 24,
  "ut_prefix" : 24,
  "gatewayIP" : null
}, {
  "id" : 23,
  "trIp" : "10.0.20.23/24",
  "trVlanId" : 123,
  "utIp" : "10.0.40.23/24",
  "utVlanId" : 223,
  "tr_prefix" : 24,
  "ut_prefix" : 24,
  "gatewayIP" : null
            }, {
              "id" : 24,
              "trIp" : "10.0.20.24/24",
              "trVlanId" : 124,
              "utIp" : "10.0.40.24/24",
              "utVlanId" : 224,
              "tr_prefix" : 24,
              "ut_prefix" : 24,
              "gatewayIP" : null
            }, {
              "id" : 25,
              "trIp" : "10.0.20.25/24",
              "trVlanId" : 125,
              "utIp" : "10.0.40.25/24",
              "utVlanId" : 225,
              "tr_prefix" : 24,
              "ut_prefix" : 24,
              "gatewayIP" : null
            }, {
              "id" : 26,
              "trIp" : "10.0.20.26/24",
              "trVlanId" : 126,
              "utIp" : "10.0.40.26/24",
              "utVlanId" : 226,
              "tr_prefix" : 24,
              "ut_prefix" : 24,
              "gatewayIP" : null
            }, {
              "id" : 27,
              "trIp" : "10.0.20.27/24",
              "trVlanId" : 127,
              "utIp" : "10.0.40.27/24",
              "utVlanId" : 227,
              "tr_prefix" : 24,
              "ut_prefix" : 24,
              "gatewayIP" : null
            }, {
              "id" : 28,
              "trIp" : "10.0.20.28/24",
              "trVlanId" : 128,
              "utIp" : "10.0.40.28/24",
              "utVlanId" : 228,
              "tr_prefix" : 24,
              "ut_prefix" : 24,
              "gatewayIP" : null
            }, {
              "id" : 29,
              "trIp" : "10.0.20.29/24",
              "trVlanId" : 129,
              "utIp" : "10.0.40.29/24",
              "utVlanId" : 229,
              "tr_prefix" : 24,
              "ut_prefix" : 24,
              "gatewayIP" : null
            }, {
              "id" : 30,
              "trIp" : "10.0.20.30/24",
              "trVlanId" : 130,
              "utIp" : "10.0.40.30/24",
              "utVlanId" : 230,
              "tr_prefix" : 24,
              "ut_prefix" : 24,
              "gatewayIP" : null
            }, {
              "id" : 31,
              "trIp" : "10.0.20.31/24",
              "trVlanId" : 131,
              "utIp" : "10.0.40.31/24",
              "utVlanId" : 231,
              "tr_prefix" : 24,
              "ut_prefix" : 24,
              "gatewayIP" : null
            }, {
              "id" : 32,
              "trIp" : "10.0.20.32/24",
              "trVlanId" : 132,
              "utIp" : "10.0.40.32/24",
              "utVlanId" : 232,
              "tr_prefix" : 24,
              "ut_prefix" : 24,
              "gatewayIP" : null
            }, {
              "id" : 33,
              "trIp" : "10.0.20.33/24",
              "trVlanId" : 133,
              "utIp" : "10.0.40.33/24",
              "utVlanId" : 233,
              "tr_prefix" : 24,
              "ut_prefix" : 24,
              "gatewayIP" : null
            }, {
              "id" : 34,
              "trIp" : "10.0.20.34/24",
              "trVlanId" : 134,
              "utIp" : "10.0.40.34/24",
              "utVlanId" : 234,
              "tr_prefix" : 24,
              "ut_prefix" : 24,
              "gatewayIP" : null
            }, {
              "id" : 35,
              "trIp" : "10.0.20.35/24",
              "trVlanId" : 135,
              "utIp" : "10.0.40.35/24",
              "utVlanId" : 235,
              "tr_prefix" : 24,
              "ut_prefix" : 24,
              "gatewayIP" : null
            }, {
              "id" : 36,
              "trIp" : "10.0.20.36/24",
              "trVlanId" : 136,
              "utIp" : "10.0.40.36/24",
              "utVlanId" : 236,
              "tr_prefix" : 24,
              "ut_prefix" : 24,
              "gatewayIP" : null
            }, {
              "id" : 37,
              "trIp" : "10.0.20.37/24",
              "trVlanId" : 137,
              "utIp" : "10.0.40.37/24",
              "utVlanId" : 237,
              "tr_prefix" : 24,
              "ut_prefix" : 24,
              "gatewayIP" : null
            }, {
              "id" : 38,
              "trIp" : "10.0.20.38/24",
              "trVlanId" : 138,
              "utIp" : "10.0.40.38/24",
              "utVlanId" : 238,
              "tr_prefix" : 24,
              "ut_prefix" : 24,
              "gatewayIP" : null
            }, {
              "id" : 39,
              "trIp" : "10.0.20.39/24",
              "trVlanId" : 139,
              "utIp" : "10.0.40.39/24",
              "utVlanId" : 239,
              "tr_prefix" : 24,
              "ut_prefix" : 24,
              "gatewayIP" : null
            }, {
              "id" : 40,
              "trIp" : "10.0.20.40/24",
              "trVlanId" : 140,
              "utIp" : "10.0.40.40/24",
              "utVlanId" : 240,
              "tr_prefix" : 24,
              "ut_prefix" : 24,
              "gatewayIP" : null
            }, {
              "id" : 41,
              "trIp" : "10.0.20.41/24",
              "trVlanId" : 141,
              "utIp" : "10.0.40.41/24",
              "utVlanId" : 241,
              "tr_prefix" : 24,
              "ut_prefix" : 24,
              "gatewayIP" : null
            }, {
              "id" : 42,
              "trIp" : "10.0.20.42/24",
              "trVlanId" : 142,
              "utIp" : "10.0.40.42/24",
              "utVlanId" : 242,
              "tr_prefix" : 24,
              "ut_prefix" : 24,
              "gatewayIP" : null
            }, {
              "id" : 43,
              "trIp" : "10.0.20.43/24",
              "trVlanId" : 143,
              "utIp" : "10.0.40.43/24",
              "utVlanId" : 243,
              "tr_prefix" : 24,
              "ut_prefix" : 24,
              "gatewayIP" : null
            }, {
              "id" : 44,
              "trIp" : "10.0.20.44/24",
              "trVlanId" : 144,
              "utIp" : "10.0.40.44/24",
              "utVlanId" : 244,
              "tr_prefix" : 24,
              "ut_prefix" : 24,
              "gatewayIP" : null
            }, {
              "id" : 45,
              "trIp" : "10.0.20.45/24",
              "trVlanId" : 145,
              "utIp" : "10.0.40.45/24",
              "utVlanId" : 245,
              "tr_prefix" : 24,
              "ut_prefix" : 24,
              "gatewayIP" : null
            }, {
              "id" : 46,
              "trIp" : "10.0.20.46/24",
              "trVlanId" : 146,
              "utIp" : "10.0.40.46/24",
              "utVlanId" : 246,
              "tr_prefix" : 24,
              "ut_prefix" : 24,
              "gatewayIP" : null
            }, {
              "id" : 47,
              "trIp" : "10.0.20.47/24",
              "trVlanId" : 147,
              "utIp" : "10.0.40.47/24",
              "utVlanId" : 247,
              "tr_prefix" : 24,
              "ut_prefix" : 24,
              "gatewayIP" : null
            }, {
              "id" : 48,
              "trIp" : "10.0.20.48/24",
              "trVlanId" : 148,
              "utIp" : "10.0.40.48/24",
              "utVlanId" : 248,
              "tr_prefix" : 24,
              "ut_prefix" : 24,
              "gatewayIP" : null
            }, {
              "id" : 49,
              "trIp" : "10.0.20.49/24",
              "trVlanId" : 149,
              "utIp" : "10.0.40.49/24",
              "utVlanId" : 249,
              "tr_prefix" : 24,
              "ut_prefix" : 24,
              "gatewayIP" : null
            }, {
              "id" : 50,
              "trIp" : "10.0.20.50/24",
              "trVlanId" : 150,
              "utIp" : "10.0.40.50/24",
              "utVlanId" : 250,
              "tr_prefix" : 24,
              "ut_prefix" : 24,
              "gatewayIP" : null
            }, {
              "id" : 51,
              "trIp" : "10.0.20.51/24",
              "trVlanId" : 151,
              "utIp" : "10.0.40.51/24",
              "utVlanId" : 251,
              "tr_prefix" : 24,
              "ut_prefix" : 24,
              "gatewayIP" : null
            }, {
              "id" : 52,
              "trIp" : "10.0.20.52/24",
              "trVlanId" : 152,
              "utIp" : "10.0.40.52/24",
              "utVlanId" : 252,
              "tr_prefix" : 24,
              "ut_prefix" : 24,
              "gatewayIP" : null
            }, {
              "id" : 53,
              "trIp" : "10.0.20.53/24",
              "trVlanId" : 153,
              "utIp" : "10.0.40.53/24",
              "utVlanId" : 253,
              "tr_prefix" : 24,
              "ut_prefix" : 24,
              "gatewayIP" : null
            }, {
              "id" : 54,
              "trIp" : "10.0.20.54/24",
              "trVlanId" : 154,
              "utIp" : "10.0.40.54/24",
              "utVlanId" : 254,
              "tr_prefix" : 24,
              "ut_prefix" : 24,
              "gatewayIP" : null
            }, {
              "id" : 55,
              "trIp" : "10.0.20.55/24",
              "trVlanId" : 155,
              "utIp" : "10.0.40.55/24",
              "utVlanId" : 255,
              "tr_prefix" : 24,
              "ut_prefix" : 24,
              "gatewayIP" : null
            }, {
              "id" : 56,
              "trIp" : "10.0.20.56/24",
              "trVlanId" : 156,
              "utIp" : "10.0.40.56/24",
              "utVlanId" : 256,
              "tr_prefix" : 24,
              "ut_prefix" : 24,
              "gatewayIP" : null
            }, {
              "id" : 57,
              "trIp" : "10.0.20.57/24",
              "trVlanId" : 157,
              "utIp" : "10.0.40.57/24",
              "utVlanId" : 257,
              "tr_prefix" : 24,
              "ut_prefix" : 24,
              "gatewayIP" : null
            }, {
              "id" : 58,
              "trIp" : "10.0.20.58/24",
              "trVlanId" : 158,
              "utIp" : "10.0.40.58/24",
              "utVlanId" : 258,
              "tr_prefix" : 24,
              "ut_prefix" : 24,
              "gatewayIP" : null
            }, {
              "id" : 59,
              "trIp" : "10.0.20.59/24",
              "trVlanId" : 159,
              "utIp" : "10.0.40.59/24",
              "utVlanId" : 259,
              "tr_prefix" : 24,
              "ut_prefix" : 24,
              "gatewayIP" : null
            }, {
              "id" : 60,
              "trIp" : "10.0.20.60/24",
              "trVlanId" : 160,
              "utIp" : "10.0.40.60/24",
              "utVlanId" : 260,
              "tr_prefix" : 24,
              "ut_prefix" : 24,
              "gatewayIP" : null
            }, {
              "id" : 61,
              "trIp" : "10.0.20.61/24",
              "trVlanId" : 161,
              "utIp" : "10.0.40.61/24",
              "utVlanId" : 261,
              "tr_prefix" : 24,
              "ut_prefix" : 24,
              "gatewayIP" : null
            }, {
              "id" : 62,
              "trIp" : "10.0.20.62/24",
              "trVlanId" : 162,
              "utIp" : "10.0.40.62/24",
              "utVlanId" : 262,
              "tr_prefix" : 24,
              "ut_prefix" : 24,
              "gatewayIP" : null
            }, {
              "id" : 63,
              "trIp" : "10.0.20.63/24",
              "trVlanId" : 163,
              "utIp" : "10.0.40.63/24",
              "utVlanId" : 263,
              "tr_prefix" : 24,
              "ut_prefix" : 24,
              "gatewayIP" : null
            }, {
              "id" : 64,
              "trIp" : "10.0.20.64/24",
              "trVlanId" : 164,
              "utIp" : "10.0.40.64/24",
              "utVlanId" : 264,
              "tr_prefix" : 24,
              "ut_prefix" : 24,
              "gatewayIP" : null
            }, {
              "id" : 65,
              "trIp" : "10.0.20.65/24",
              "trVlanId" : 165,
              "utIp" : "10.0.40.65/24",
              "utVlanId" : 265,
              "tr_prefix" : 24,
              "ut_prefix" : 24,
              "gatewayIP" : null
            }, {
              "id" : 66,
              "trIp" : "10.0.20.66/24",
              "trVlanId" : 166,
              "utIp" : "10.0.40.66/24",
              "utVlanId" : 266,
              "tr_prefix" : 24,
              "ut_prefix" : 24,
              "gatewayIP" : null
            }, {
              "id" : 67,
              "trIp" : "10.0.20.67/24",
              "trVlanId" : 167,
              "utIp" : "10.0.40.67/24",
              "utVlanId" : 267,
              "tr_prefix" : 24,
              "ut_prefix" : 24,
              "gatewayIP" : null
            }, {
              "id" : 68,
              "trIp" : "10.0.20.68/24",
              "trVlanId" : 168,
              "utIp" : "10.0.40.68/24",
              "utVlanId" : 268,
              "tr_prefix" : 24,
              "ut_prefix" : 24,
              "gatewayIP" : null
            }, {
              "id" : 69,
              "trIp" : "10.0.20.69/24",
              "trVlanId" : 169,
              "utIp" : "10.0.40.69/24",
              "utVlanId" : 269,
              "tr_prefix" : 24,
              "ut_prefix" : 24,
              "gatewayIP" : null
            }, {
              "id" : 70,
              "trIp" : "10.0.20.70/24",
              "trVlanId" : 170,
              "utIp" : "10.0.40.70/24",
              "utVlanId" : 270,
              "tr_prefix" : 24,
              "ut_prefix" : 24,
              "gatewayIP" : null
            }, {
              "id" : 71,
              "trIp" : "10.0.20.71/24",
              "trVlanId" : 171,
              "utIp" : "10.0.40.71/24",
              "utVlanId" : 271,
              "tr_prefix" : 24,
              "ut_prefix" : 24,
              "gatewayIP" : null
            }, {
              "id" : 72,
              "trIp" : "10.0.20.72/24",
              "trVlanId" : 172,
              "utIp" : "10.0.40.72/24",
              "utVlanId" : 272,
              "tr_prefix" : 24,
              "ut_prefix" : 24,
              "gatewayIP" : null
            }, {
              "id" : 73,
              "trIp" : "10.0.20.73/24",
              "trVlanId" : 173,
              "utIp" : "10.0.40.73/24",
              "utVlanId" : 273,
              "tr_prefix" : 24,
              "ut_prefix" : 24,
              "gatewayIP" : null
            }, {
              "id" : 74,
              "trIp" : "10.0.20.74/24",
              "trVlanId" : 174,
              "utIp" : "10.0.40.74/24",
              "utVlanId" : 274,
              "tr_prefix" : 24,
              "ut_prefix" : 24,
              "gatewayIP" : null
            }, {
              "id" : 75,
              "trIp" : "10.0.20.75/24",
              "trVlanId" : 175,
              "utIp" : "10.0.40.75/24",
              "utVlanId" : 275,
              "tr_prefix" : 24,
              "ut_prefix" : 24,
              "gatewayIP" : null
            }, {
              "id" : 76,
              "trIp" : "10.0.20.76/24",
              "trVlanId" : 176,
              "utIp" : "10.0.40.76/24",
              "utVlanId" : 276,
              "tr_prefix" : 24,
              "ut_prefix" : 24,
              "gatewayIP" : null
            }, {
              "id" : 77,
              "trIp" : "10.0.20.77/24",
              "trVlanId" : 177,
              "utIp" : "10.0.40.77/24",
              "utVlanId" : 277,
              "tr_prefix" : 24,
              "ut_prefix" : 24,
              "gatewayIP" : null
            }, {
              "id" : 78,
              "trIp" : "10.0.20.78/24",
              "trVlanId" : 178,
              "utIp" : "10.0.40.78/24",
              "utVlanId" : 278,
              "tr_prefix" : 24,
              "ut_prefix" : 24,
              "gatewayIP" : null
            }, {
              "id" : 79,
              "trIp" : "10.0.20.79/24",
              "trVlanId" : 179,
              "utIp" : "10.0.40.79/24",
              "utVlanId" : 279,
              "tr_prefix" : 24,
              "ut_prefix" : 24,
              "gatewayIP" : null
            }, {
              "id" : 80,
              "trIp" : "10.0.20.80/24",
              "trVlanId" : 180,
              "utIp" : "10.0.40.80/24",
              "utVlanId" : 280,
              "tr_prefix" : 24,
              "ut_prefix" : 24,
              "gatewayIP" : null
            }, {
              "id" : 81,
              "trIp" : "10.0.20.81/24",
              "trVlanId" : 181,
              "utIp" : "10.0.40.81/24",
              "utVlanId" : 281,
              "tr_prefix" : 24,
              "ut_prefix" : 24,
              "gatewayIP" : null
            }, {
              "id" : 82,
              "trIp" : "10.0.20.82/24",
              "trVlanId" : 182,
              "utIp" : "10.0.40.82/24",
              "utVlanId" : 282,
              "tr_prefix" : 24,
              "ut_prefix" : 24,
              "gatewayIP" : null
            }, {
              "id" : 83,
              "trIp" : "10.0.20.83/24",
              "trVlanId" : 183,
              "utIp" : "10.0.40.83/24",
              "utVlanId" : 283,
              "tr_prefix" : 24,
              "ut_prefix" : 24,
              "gatewayIP" : null
            }, {
              "id" : 84,
              "trIp" : "10.0.20.84/24",
              "trVlanId" : 184,
              "utIp" : "10.0.40.84/24",
              "utVlanId" : 284,
              "tr_prefix" : 24,
              "ut_prefix" : 24,
              "gatewayIP" : null
            }, {
              "id" : 85,
              "trIp" : "10.0.20.85/24",
              "trVlanId" : 185,
              "utIp" : "10.0.40.85/24",
              "utVlanId" : 285,
              "tr_prefix" : 24,
              "ut_prefix" : 24,
              "gatewayIP" : null
            }, {
              "id" : 86,
              "trIp" : "10.0.20.86/24",
              "trVlanId" : 186,
              "utIp" : "10.0.40.86/24",
              "utVlanId" : 286,
              "tr_prefix" : 24,
              "ut_prefix" : 24,
              "gatewayIP" : null
            }, {
              "id" : 87,
              "trIp" : "10.0.20.87/24",
              "trVlanId" : 187,
              "utIp" : "10.0.40.87/24",
              "utVlanId" : 287,
              "tr_prefix" : 24,
              "ut_prefix" : 24,
              "gatewayIP" : null
            }, {
              "id" : 88,
              "trIp" : "10.0.20.88/24",
              "trVlanId" : 188,
              "utIp" : "10.0.40.88/24",
              "utVlanId" : 288,
              "tr_prefix" : 24,
              "ut_prefix" : 24,
              "gatewayIP" : null
            }, {
              "id" : 89,
              "trIp" : "10.0.20.89/24",
              "trVlanId" : 189,
              "utIp" : "10.0.40.89/24",
              "utVlanId" : 289,
              "tr_prefix" : 24,
              "ut_prefix" : 24,
              "gatewayIP" : null
            }, {
              "id" : 90,
              "trIp" : "10.0.20.90/24",
              "trVlanId" : 190,
              "utIp" : "10.0.40.90/24",
              "utVlanId" : 290,
              "tr_prefix" : 24,
              "ut_prefix" : 24,
              "gatewayIP" : null
            }, {
              "id" : 91,
              "trIp" : "10.0.20.91/24",
              "trVlanId" : 191,
              "utIp" : "10.0.40.91/24",
              "utVlanId" : 291,
              "tr_prefix" : 24,
              "ut_prefix" : 24,
              "gatewayIP" : null
            }, {
              "id" : 92,
              "trIp" : "10.0.20.92/24",
              "trVlanId" : 192,
              "utIp" : "10.0.40.92/24",
              "utVlanId" : 292,
              "tr_prefix" : 24,
              "ut_prefix" : 24,
              "gatewayIP" : null
            }, {
              "id" : 93,
              "trIp" : "10.0.20.93/24",
              "trVlanId" : 193,
              "utIp" : "10.0.40.93/24",
              "utVlanId" : 293,
              "tr_prefix" : 24,
              "ut_prefix" : 24,
              "gatewayIP" : null
            } ]
          },
          "delay" : {
            "timeUnit" : "SECONDS",
            "value" : 2
          }
        }
      }

    with id:

      4042f95d-b15c-4762-b443-97d387b649e1

    2021-08-23 22:53:31 5.11.2 INFO creating expectation:

      {
        "id" : "6672d5e1-16c3-439e-990e-3cc5a98431b7",
        "priority" : 0,
        "httpRequest" : {
          "method" : "GET",
          "path" : "/skylightweb/deleteNat",
          "queryStringParameters" : {
            "gatewayIP" : [ ".+" ]
          }
        },
        "times" : {
          "unlimited" : true
        },
        "timeToLive" : {
          "unlimited" : true
        },
        "httpResponse" : {
          "statusCode" : 204,
          "headers" : {
            "Content-Type" : [ "application/json" ],
            "Access-Control-Allow-Origin" : [ "http://localhost:5000" ]
          },
          "delay" : {
            "timeUnit" : "SECONDS",
            "value" : 2
          }
        }
      }

    with id:

      6672d5e1-16c3-439e-990e-3cc5a98431b7

    2021-08-23 22:53:31 5.11.2 INFO creating expectation:

      {
        "id" : "e8a91b51-5a37-4879-8ce2-8fe66459cf35",
        "priority" : 0,
        "httpRequest" : {
          "method" : "GET",
          "path" : "/skylightweb/saveNat",
          "queryStringParameters" : {
            "gatewayIP" : [ ".+" ]
          }
        },
        "times" : {
          "unlimited" : true
        },
        "timeToLive" : {
          "unlimited" : true
        },
        "httpResponse" : {
          "statusCode" : 200,
          "headers" : {
            "Content-Type" : [ "application/json" ],
            "Access-Control-Allow-Origin" : [ "http://localhost:5000" ]
          },
          "delay" : {
            "timeUnit" : "SECONDS",
            "value" : 2
          }
        }
      }

    with id:

      e8a91b51-5a37-4879-8ce2-8fe66459cf35

    2021-08-23 22:53:31 5.11.2 INFO creating expectation:

      {
        "id" : "5580d4af-5f7c-41bf-9252-157fc5e341f3",
        "priority" : 0,
        "httpRequest" : {
          "method" : "GET",
          "path" : "/skylightweb/addToDoList"
        },
        "times" : {
          "unlimited" : true
        },
        "timeToLive" : {
          "unlimited" : true
        },
        "httpResponse" : {
          "statusCode" : 204,
          "headers" : {
            "Content-Type" : [ "application/json" ],
            "Access-Control-Allow-Origin" : [ "http://localhost:5000" ]
          },
          "body" : "SUCCESS",
          "delay" : {
            "timeUnit" : "SECONDS",
            "value" : 2
          }
        }
      }

    with id:

      5580d4af-5f7c-41bf-9252-157fc5e341f3

    2021-08-23 22:53:31 5.11.2 INFO creating expectation:

      {
        "id" : "05b020df-79eb-4b52-a550-6264971449ba",
        "priority" : 0,
        "httpRequest" : {
          "method" : "GET",
          "path" : "/skylightweb/getEpcLogs"
        },
        "times" : {
          "unlimited" : true
        },
        "timeToLive" : {
          "unlimited" : true
        },
        "httpResponse" : {
          "statusCode" : 200,
          "headers" : {
            "Content-Type" : [ "application/json" ],
            "Access-Control-Allow-Origin" : [ "http://localhost:5000" ]
          },
          "body" : {
            "type" : "JSON",
            "json" : [ {
              "endpoint_id" : 23,
              "filename" : "E23-20212308_145541-20210823_145911.log",
              "del_date" : "2020-03-21",
              "task_status" : 0
            }, {
              "endpoint_id" : 12,
              "filename" : "E12-20212308_145541-20210823_145911.log",
              "del_date" : "2020-07-27",
              "task_status" : 1
            }, {
              "endpoint_id" : 33,
              "filename" : "E33-20212308_145541-20210823_145911.log",
              "del_date" : "2020-04-16",
              "task_status" : 2
            }, {
              "endpoint_id" : 44,
              "filename" : "E44-20212308_145541-20210823_145911.log",
              "del_date" : "2020-08-10",
              "task_status" : 3
            } ]
          },
          "delay" : {
            "timeUnit" : "SECONDS",
            "value" : 2
          }
        }
      }

    with id:

      05b020df-79eb-4b52-a550-6264971449ba

    2021-08-23 22:53:31 5.11.2 INFO creating expectation:

      {
        "id" : "acb94b27-b9de-4fa9-aecb-2869b520990a",
        "priority" : 0,
        "httpRequest" : {
          "method" : "GET",
          "path" : "/skylightweb/isBem"
        },
        "times" : {
          "unlimited" : true
        },
        "timeToLive" : {
          "unlimited" : true
        },
        "httpResponse" : {
          "statusCode" : 200,
          "headers" : {
            "Access-Control-Allow-Origin" : [ "http://localhost:5000" ]
          },
          "body" : "true",
          "delay" : {
            "timeUnit" : "SECONDS",
            "value" : 2
          }
        }
      }

    with id:

      acb94b27-b9de-4fa9-aecb-2869b520990a

    2021-08-23 22:53:31 5.11.2 SEVERE exception binding to port(s) [8000]
    java.lang.RuntimeException: Exception while binding MockServer to port 8000
            at org.mockserver.lifecycle.LifeCycle.bindPorts(LifeCycle.java:212)
            at org.mockserver.lifecycle.LifeCycle.bindServerPorts(LifeCycle.java:176)
            at org.mockserver.netty.MockServer.createServerBootstrap(MockServer.java:118)
            at org.mockserver.netty.MockServer.<init>(MockServer.java:51)
            at org.mockserver.netty.MockServer.<init>(MockServer.java:41)
            at org.mockserver.cli.Main.main(Main.java:100)
    Caused by: java.net.BindException: Address already in use
            at java.base/sun.nio.ch.Net.bind0(Native Method)
            at java.base/sun.nio.ch.Net.bind(Net.java:552)
            at java.base/sun.nio.ch.ServerSocketChannelImpl.netBind(ServerSocketChannelImpl.java:336)
            at java.base/sun.nio.ch.ServerSocketChannelImpl.bind(ServerSocketChannelImpl.java:294)
            at io.netty.channel.socket.nio.NioServerSocketChannel.doBind(NioServerSocketChannel.java:134)
            at io.netty.channel.AbstractChannel$AbstractUnsafe.bind(AbstractChannel.java:550)
            at io.netty.channel.DefaultChannelPipeline$HeadContext.bind(DefaultChannelPipeline.java:1334)
            at io.netty.channel.AbstractChannelHandlerContext.invokeBind(AbstractChannelHandlerContext.java:506)
            at io.netty.channel.AbstractChannelHandlerContext.bind(AbstractChannelHandlerContext.java:491)
            at io.netty.channel.DefaultChannelPipeline.bind(DefaultChannelPipeline.java:973)
            at io.netty.channel.AbstractChannel.bind(AbstractChannel.java:248)
            at io.netty.bootstrap.AbstractBootstrap$2.run(AbstractBootstrap.java:356)
            at io.netty.util.concurrent.AbstractEventExecutor.safeExecute(AbstractEventExecutor.java:164)
            at io.netty.util.concurrent.SingleThreadEventExecutor.runAllTasks(SingleThreadEventExecutor.java:472)
            at io.netty.channel.nio.NioEventLoop.run(NioEventLoop.java:500)
            at io.netty.util.concurrent.SingleThreadEventExecutor$4.run(SingleThreadEventExecutor.java:989)
            at io.netty.util.internal.ThreadExecutorMap$2.run(ThreadExecutorMap.java:74)
            at java.base/java.lang.Thread.run(Thread.java:831)

    2021-08-23 22:53:31 5.11.2 FINE exception while retrieving port from channel future, ignoring port for this channel

      java.util.concurrent.ExecutionException: java.net.BindException: Address already in use

    2021-08-23 22:53:31 5.11.2 FINE exception while retrieving port from channel future, ignoring port for this channel

      java.util.concurrent.ExecutionException: java.net.BindException: Address already in use

    2021-08-23 22:53:31 5.11.2 INFO stopped for ports: []
    2021-08-23 22:53:31 5.11.2 SEVERE exception while starting:{}
    java.lang.RuntimeException: Exception while binding MockServer to port 8000
            at org.mockserver.lifecycle.LifeCycle.bindPorts(LifeCycle.java:212)
            at org.mockserver.lifecycle.LifeCycle.bindServerPorts(LifeCycle.java:176)
            at org.mockserver.netty.MockServer.createServerBootstrap(MockServer.java:118)
            at org.mockserver.netty.MockServer.<init>(MockServer.java:51)
            at org.mockserver.netty.MockServer.<init>(MockServer.java:41)
            at org.mockserver.cli.Main.main(Main.java:100)
    Caused by: java.net.BindException: Address already in use
            at java.base/sun.nio.ch.Net.bind0(Native Method)
            at java.base/sun.nio.ch.Net.bind(Net.java:552)
            at java.base/sun.nio.ch.ServerSocketChannelImpl.netBind(ServerSocketChannelImpl.java:336)
            at java.base/sun.nio.ch.ServerSocketChannelImpl.bind(ServerSocketChannelImpl.java:294)
            at io.netty.channel.socket.nio.NioServerSocketChannel.doBind(NioServerSocketChannel.java:134)
            at io.netty.channel.AbstractChannel$AbstractUnsafe.bind(AbstractChannel.java:550)
            at io.netty.channel.DefaultChannelPipeline$HeadContext.bind(DefaultChannelPipeline.java:1334)
            at io.netty.channel.AbstractChannelHandlerContext.invokeBind(AbstractChannelHandlerContext.java:506)
            at io.netty.channel.AbstractChannelHandlerContext.bind(AbstractChannelHandlerContext.java:491)
            at io.netty.channel.DefaultChannelPipeline.bind(DefaultChannelPipeline.java:973)
            at io.netty.channel.AbstractChannel.bind(AbstractChannel.java:248)
            at io.netty.bootstrap.AbstractBootstrap$2.run(AbstractBootstrap.java:356)
            at io.netty.util.concurrent.AbstractEventExecutor.safeExecute(AbstractEventExecutor.java:164)
            at io.netty.util.concurrent.SingleThreadEventExecutor.runAllTasks(SingleThreadEventExecutor.java:472)
            at io.netty.channel.nio.NioEventLoop.run(NioEventLoop.java:500)
            at io.netty.util.concurrent.SingleThreadEventExecutor$4.run(SingleThreadEventExecutor.java:989)
            at io.netty.util.internal.ThreadExecutorMap$2.run(ThreadExecutorMap.java:74)
            at java.base/java.lang.Thread.run(Thread.java:831)

      java -jar <path to mockserver-jetty-jar-with-dependencies.jar> -serverPort <port> [-proxyRemotePort <port>] [-proxyRemoteHost <hostname>] [-logLevel <level>]

        valid options are:
            -serverPort <port>           The HTTP, HTTPS, SOCKS and HTTP CONNECT
                                        port(s) for both mocking and proxying
                                        requests.  Port unification is used to
                                        support all protocols for proxying and
                                        mocking on the same port(s). Supports
                                        comma separated list for binding to
                                        multiple ports.

            -proxyRemotePort <port>      Optionally enables port forwarding mode.
                                        When specified all requests received will
                                        be forwarded to the specified port, unless
                                        they match an expectation.

            -proxyRemoteHost <hostname>  Specified the host to forward all proxy
                                        requests to when port forwarding mode has
                                        been enabled using the proxyRemotePort
                                        option.  This setting is ignored unless
                                        proxyRemotePort has been specified. If no
                                        value is provided for proxyRemoteHost when
                                        proxyRemotePort has been specified,
                                        proxyRemoteHost will default to "localhost".

            -logLevel <level>            Optionally specify log level using SLF4J levels:
                                        TRACE, DEBUG, INFO, WARN, ERROR, OFF or Java
                                        Logger levels: FINEST, FINE, INFO, WARNING,
                                        SEVERE or OFF. If not specified default is INFO

      i.e. java -jar ./mockserver-jetty-jar-with-dependencies.jar -serverPort 1080 -proxyRemotePort 80 -proxyRemoteHost www.mock-server.com -logLevel WARN

    Mon Aug 23 2021 22:53:32 GMT+0530 (India Standard Time)
    Program bash ./bash/startMockServer.sh exited with code 0
`;
