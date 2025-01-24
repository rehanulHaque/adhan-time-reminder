import { Coordinates, CalculationMethod, PrayerTimes } from "adhan";
import dotenv from 'dotenv'
dotenv.config()
import cron from "node-cron";
import moment from "moment";
import { sendMail } from "./sendMail";

interface PrayerTimesProps {
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

const getPrayerTimes = (): PrayerTimesProps => {
  const coordinates = new Coordinates(parseInt(process.env.LONG!), parseInt(process.env.LAT!));
  const params = CalculationMethod.MoonsightingCommittee();
  const date = new Date();
  const prayerTimes = new PrayerTimes(coordinates, date, params);

  return {
    fajr: moment(prayerTimes.fajr).format("HH:mm"),
    dhuhr: moment(prayerTimes.dhuhr).format("HH:mm"),
    asr: moment(prayerTimes.asr).format("HH:mm"),
    maghrib: moment(prayerTimes.maghrib).format("HH:mm"),
    isha: moment(prayerTimes.isha).format("HH:mm"),
  };
};

// Schedule tasks for each prayer time
const schedulePrayerNotifications = () => {
  const prayerTimes = getPrayerTimes();

  const prayerSchedules = [
    { name: "Fajr", time: prayerTimes.fajr },
    { name: "Dhuhr", time: prayerTimes.dhuhr },
    { name: "Asr", time: prayerTimes.asr },
    { name: "Maghrib", time: prayerTimes.maghrib },
    { name: "Isha", time: prayerTimes.isha },
  ];

  prayerSchedules.forEach((prayer) => {
    // Schedule the task 5 minutes before the prayer time
    const prayerMoment = moment(prayer.time, "HH:mm").subtract(5, "minutes");
    const cronTime = `${prayerMoment.minute()} ${prayerMoment.hour()} * * *`;

    cron.schedule(cronTime, () => {
      console.log(`Sending email for ${prayer.name}`);
      sendMail(
        ["rehanulhaque00@gmail.com"],
        `Now pray ${prayer.name} ADHAN`,
        `<h1>${prayer.name} adhan is near. The prayer ${prayer.name} timing is ${prayer.time}</h1>`
      );
    });

    console.log(`Scheduled ${prayer.name} notification at ${cronTime}`);
  });
};

schedulePrayerNotifications();