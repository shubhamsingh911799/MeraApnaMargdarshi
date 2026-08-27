const HealthProfile = require("../models/HealthProfile");
const ApiError = require("../utils/ApiError");

/* =========================================================
   HELPER — CALCULATE SLEEP DURATION
========================================================= */

const calculateSleepDuration = (sleepTime, wakeTime) => {

    if (!sleepTime || !wakeTime) {
        return null;
    }

    const [sleepHour, sleepMinute] =
        sleepTime.split(":").map(Number);

    const [wakeHour, wakeMinute] =
        wakeTime.split(":").map(Number);

    if (
        Number.isNaN(sleepHour) ||
        Number.isNaN(sleepMinute) ||
        Number.isNaN(wakeHour) ||
        Number.isNaN(wakeMinute)
    ) {
        return null;
    }

    let sleepMinutes =
        sleepHour * 60 + sleepMinute;

    let wakeMinutes =
        wakeHour * 60 + wakeMinute;

    if (wakeMinutes <= sleepMinutes) {
        wakeMinutes += 24 * 60;
    }

    const totalMinutes =
        wakeMinutes - sleepMinutes;

    return {

        hours:
            Math.floor(totalMinutes / 60),

        minutes:
            totalMinutes % 60,

        totalMinutes,

    };

};



/* =========================================================
   HELPER — BMI
========================================================= */

const calculateBMI = (
    height,
    weight,
    age
) => {

    if (!height || !weight) {
        return null;
    }

    const h =
        Number(height) / 100;

    const w =
        Number(weight);

    if (h <= 0 || w <= 0) {
        return null;
    }

    const bmi =
        w / (h * h);

    let category =
        "Informational only";

    if (Number(age) >= 18) {

        if (bmi < 18.5) {

            category =
                "Below the adult reference range";

        }

        else if (bmi < 25) {

            category =
                "Within the adult reference range";

        }

        else if (bmi < 30) {

            category =
                "Above the adult reference range";

        }

        else {

            category =
                "Higher adult reference range";

        }

    }

    return {

        value:
            Number(bmi.toFixed(1)),

        category,

    };

};



/* =========================================================
   HELPER — ACTIVITY
========================================================= */

const analyzeActivity = (
    activityLevel,
    exercise
) => {

    const activity =
        String(activityLevel || "")
        .toLowerCase();

    let level =
        "Not specified";

    let recommendation =
        "Add regular physical activity according to your routine.";

    if (
        activity.includes("high") ||
        activity.includes("very active")
    ) {

        level =
            "High activity";

        recommendation =
            "Maintain activity and focus on recovery.";

    }

    else if (
        activity.includes("moderate")
    ) {

        level =
            "Moderate activity";

        recommendation =
            "Maintain consistency.";

    }

    else if (
        activity.includes("low") ||
        activity.includes("sedentary")
    ) {

        level =
            "Low activity";

        recommendation =
            "Increase daily movement gradually.";

    }

    return {

        level,

        exercise:
            exercise || "Not specified",

        recommendation,

    };

};



/* =========================================================
   SAVE HEALTH PROFILE SERVICE
========================================================= */

const saveHealthProfileService = async (
    userId,
    body
) => {

    const profile =
        await HealthProfile.findOneAndUpdate(

            {
                user: userId,
            },

            {

                user: userId,

                ...body,

            },

            {

                new: true,

                upsert: true,

                runValidators: true,

            }

        );

    return profile;

};
/* =========================================================
   GET HEALTH PROFILE SERVICE
========================================================= */

const getHealthProfileService = async (userId) => {

    const profile =
        await HealthProfile.findOne({
            user: userId,
        });

    if (!profile) {
        throw new ApiError(
            404,
            "Health profile not found."
        );
    }

    return profile;
};



/* =========================================================
   GET HEALTH ANALYSIS SERVICE
========================================================= */

const getHealthAnalysisService = async (userId) => {

    const profile =
        await HealthProfile.findOne({
            user: userId,
        });

    if (!profile) {

        throw new ApiError(
            404,
            "Health profile not found."
        );

    }



    const bmi =
        calculateBMI(
            profile.height,
            profile.weight,
            profile.age
        );



    const sleep =
        calculateSleepDuration(
            profile.sleepTime,
            profile.wakeTime
        );



    const activity =
        analyzeActivity(
            profile.activityLevel,
            profile.exercise
        );



    let sleepStatus =
        "Not available";

    let sleepMessage =
        "Add your sleep schedule.";



    if (sleep) {

        if (sleep.totalMinutes < 420) {

            sleepStatus =
                "Short duration";

            sleepMessage =
                "Increase sleep duration.";

        }

        else if (sleep.totalMinutes <= 540) {

            sleepStatus =
                "Good duration";

            sleepMessage =
                "Maintain consistency.";

        }

        else {

            sleepStatus =
                "Long duration";

            sleepMessage =
                "Monitor sleep quality.";

        }

    }



    // Score calculation
    let score = 0;
    const bmiVal = bmi?.value;
    if (bmiVal) {
        if (bmiVal >= 18.5 && bmiVal <= 24.9) score += 35;
        else if (bmiVal >= 17.5 && bmiVal <= 28.0) score += 25;
        else if (bmiVal >= 16.0 && bmiVal <= 32.0) score += 15;
        else score += 5;
    } else {
        score += 20;
    }

    const totalSleepMins = sleep?.totalMinutes;
    if (totalSleepMins) {
        if (totalSleepMins >= 420 && totalSleepMins <= 540) score += 35;
        else if (totalSleepMins >= 360 && totalSleepMins <= 600) score += 25;
        else if (totalSleepMins >= 300) score += 15;
        else score += 5;
    } else {
        score += 15;
    }

    const actLower = String(profile.activityLevel || "").toLowerCase();
    if (actLower.includes("high") || actLower.includes("very active")) score += 30;
    else if (actLower.includes("moderate")) score += 25;
    else if (actLower.includes("light") || actLower.includes("low")) score += 18;
    else score += 10;

    score = Math.min(100, Math.max(0, score));

    let category = "Needs Attention";
    if (score >= 85) category = "Optimal";
    else if (score >= 70) category = "Good";
    else if (score >= 50) category = "Fair";

    const recommendations = [];
    if (bmiVal) {
        if (bmiVal < 18.5) {
            recommendations.push({
                type: "warning",
                title: "Weight Management Focus",
                description: "Your BMI indicates you are below the reference weight range. Consider adding nutrient-dense whole foods and strength training.",
            });
        } else if (bmiVal > 25.0) {
            recommendations.push({
                type: "warning",
                title: "Cardiovascular & Body Weight Care",
                description: "Your BMI is above the standard reference range. Focus on balanced portion sizes, hydration, and daily physical movement.",
            });
        } else {
            recommendations.push({
                type: "success",
                title: "Healthy Body Composition",
                description: "Your BMI is within the healthy reference range. Keep up your current nutritional habits and physical routines.",
            });
        }
    }

    if (totalSleepMins) {
        if (totalSleepMins < 420) {
            recommendations.push({
                type: "warning",
                title: "Prioritize Recovery & Rest",
                description: `You are averaging ${sleep.hours}h ${sleep.minutes}m of sleep per night. Target 7 to 8.5 hours (420+ mins) to enhance immune function and cognitive focus.`,
            });
        } else {
            recommendations.push({
                type: "success",
                title: "Optimal Sleep Recovery",
                description: `Great job maintaining ${sleep.hours}h ${sleep.minutes}m of nightly sleep! Consistency in sleep-wake timing supports peak circadian health.`,
            });
        }
    }

    if (actLower.includes("sedentary") || actLower.includes("low")) {
        recommendations.push({
            type: "info",
            title: "Increase Daily Movement",
            description: "Incorporate 20-30 minutes of daily walking, stretching, or light cardio to improve circulation and daily metabolic rate.",
        });
    } else {
        recommendations.push({
            type: "success",
            title: "Active Physical Routine",
            description: "Your activity profile reflects regular movement. Ensure adequate hydration and rest days between intense workouts.",
        });
    }

    return {
        healthScore: score,
        category,
        bmi,
        sleep: {
            duration: sleep ? `${sleep.hours}h ${sleep.minutes}m` : null,
            hours: sleep?.hours ?? null,
            minutes: sleep?.minutes ?? null,
            totalMinutes: sleep?.totalMinutes ?? null,
            status: sleepStatus,
            message: sleepMessage,
        },
        activity,
        summary: {
            height: profile.height,
            weight: profile.weight,
            age: profile.age,
            foodPreference: profile.foodPreference,
            collegeWorkTiming: profile.collegeWorkTiming,
            sleepTime: profile.sleepTime,
            wakeTime: profile.wakeTime,
            exercise: profile.exercise,
            healthConditions: profile.healthConditions,
        },
        recommendations,
        profile,
    };
};
module.exports = {

    calculateSleepDuration,

    calculateBMI,

    analyzeActivity,

    saveHealthProfileService,

    getHealthProfileService,

    getHealthAnalysisService

};