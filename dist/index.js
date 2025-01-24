"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const adhan_1 = require("adhan");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const node_cron_1 = __importDefault(require("node-cron"));
const moment_1 = __importDefault(require("moment"));
const sendMail_1 = require("./sendMail");
const getPrayerTimes = () => {
    const coordinates = new adhan_1.Coordinates(22.5509376, 88.3720192);
    const params = adhan_1.CalculationMethod.MoonsightingCommittee();
    const date = new Date();
    const prayerTimes = new adhan_1.PrayerTimes(coordinates, date, params);
    return {
        fajr: (0, moment_1.default)(prayerTimes.fajr).format("HH:mm"),
        dhuhr: (0, moment_1.default)(prayerTimes.dhuhr).format("HH:mm"),
        asr: (0, moment_1.default)(prayerTimes.asr).format("HH:mm"),
        maghrib: (0, moment_1.default)(prayerTimes.maghrib).format("HH:mm"),
        // tesing purpose
        // isha: moment('2025-01-24 18:57:00', 'YYYY-MM-DD HH:mm:ss').format("HH:mm"),
        isha: (0, moment_1.default)(prayerTimes.isha).format("HH:mm"),
    };
};
// const whichPrayerIsNear = (): string => {
//     const prayerTimes = getPrayerTimes()
//     const currentTime = moment()
//     const prayerTimesArray = [
//         { name: "Fazar", time: moment(prayerTimes.fajr, "HH:mm") },
//         { name: "Dhuhr", time: moment(prayerTimes.dhuhr, "HH:mm") },
//         { name: "Asar", time: moment(prayerTimes.asr, "HH:mm") },
//         { name: "Maghrib", time: moment(prayerTimes.maghrib, "HH:mm") },
//         { name: "Isha", time: moment(prayerTimes.isha, "HH:mm") }
//     ];
//     // Handle case where current time is after last prayer (Isha)
//     if (currentTime.isAfter(prayerTimesArray[4].time)) {
//         return "Fazar";
//     }
//     // Find the nearest prayer time
//     let nearestPrayer = prayerTimesArray[0];
//     let smallestTimeDiff = Infinity;
//     for (const prayer of prayerTimesArray) {
//         const timeDiff = prayer.time.diff(currentTime);
//         if (timeDiff > 0 && timeDiff < smallestTimeDiff) {
//             smallestTimeDiff = timeDiff;
//             nearestPrayer = prayer;
//         }
//     }
//     return nearestPrayer.name;
// };
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
        const prayerMoment = (0, moment_1.default)(prayer.time, "HH:mm").subtract(5, "minutes");
        const cronTime = `${prayerMoment.minute()} ${prayerMoment.hour()} * * *`;
        node_cron_1.default.schedule(cronTime, () => {
            console.log(`Sending email for ${prayer.name}`);
            (0, sendMail_1.sendMail)(["rehanulhaque00@gmail.com"], `Now pray ${prayer.name} ADHAN`, `<h1>${prayer.name} adhan is near. The prayer ${prayer.name} timing is ${prayer.time}</h1>`);
        });
        console.log(`Scheduled ${prayer.name} notification at ${cronTime}`);
    });
};
schedulePrayerNotifications();
