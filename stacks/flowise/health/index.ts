import { Database } from "bun:sqlite";
import {
  formatISO,
  fromUnixTime,
  differenceInSeconds,
  format,
  parse,
  getUnixTime,
} from "date-fns";

const date = getUnixTime(new Date("2024.11.20 12:00"));
const dayBefore = date - 3600 * 24 * 1.5;

enum ActivityKind {
  NOT_MEASURED = -1,
  UNKNOWN = 1,
  DEEP_SLEEP = 7,
  LIGHT_SLEEP = 6,
  NOT_WORN = 8,
}

interface Row {
  TIMESTAMP: number;
  DEVICE_ID: number;
  USER_ID: number;
  OTHER_TIMESTAMP: number;
  SOURCE: number;
  RAW_KIND: number;
  RAW_INTENSITY: number;
  STEPS: number;
  CALORIES: number;
  DISTANCE: number;
  SPO: number;
  HEART_RATE: number;
}

const samples: Array<{
  rawItems: Array<Row>;
  open: boolean;
  start?: string;
  end?: string;
  duration?: number;
  stopper?: Row;
}> = [];

function sampler(sample: Row) {
  if (sample.RAW_KIND === ActivityKind.NOT_MEASURED) {
    return;
  }

  const lastItem = samples[samples.length - 1];

  if (
    [ActivityKind.LIGHT_SLEEP, ActivityKind.DEEP_SLEEP].includes(
      sample.RAW_KIND,
    )
  ) {
    if (!lastItem?.open) {
      samples.push({
        open: true,
        rawItems: [sample],
      });
    } else {
      lastItem.rawItems.push(sample);
    }

    return;
  }

  if (
    ![ActivityKind.NOT_MEASURED].includes(sample.RAW_KIND) &&
    lastItem?.open
  ) {
    lastItem.rawItems.push(sample);
    lastItem.open = false;
    lastItem.stopper = sample;
  }
}

const db = new Database("./tmp/db");
const query = db.query(
  `
    SELECT * FROM HUAWEI_ACTIVITY_SAMPLE
      WHERE TIMESTAMP <= ${date}
        AND TIMESTAMP >= ${dayBefore}
      ORDER BY TIMESTAMP
  `,
  // `
  //   select * from HUAWEI_ACTIVITY_SAMPLE
  //   where TIMESTAMP <= ${date}
  //     and TIMESTAMP >= ${dayBefore}
  //     and HEART_RATE > -1
  // `,
);

const kinds = new Set<number>();
const sources = new Set<number>();

for (const sample of query.all()) {
  kinds.add((sample as Row).RAW_KIND);
  sources.add((sample as Row).SOURCE);
  sampler(sample as Row);
}

for (const period of samples) {
  const first = period.rawItems[0];
  const last = period.rawItems[period.rawItems.length - 1];

  const startDate = fromUnixTime(first.OTHER_TIMESTAMP);
  const endDate = fromUnixTime(last.OTHER_TIMESTAMP);

  period.start = format(startDate, "HH:mm");
  period.end = format(endDate, "HH:mm");

  period.duration = differenceInSeconds(endDate, startDate);
}

console.log(samples);

console.log("kinds", Array.from(kinds));
console.log("sources", Array.from(sources));

const totalDuration = samples
  .map((sample) => sample.duration)
  .reduce((acc, value) => {
    return (acc || 0) + (value || 0);
  });

console.log(format(fromUnixTime(totalDuration as number), "HH:mm"));
