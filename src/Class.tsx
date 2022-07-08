import moment from "moment"

moment().format();

export default class Class {
    private _courseCode: number
    private _name: string
    private _days: string[]
    private _timeStartnEnd: any[]

    constructor(courseCode:number, days: string, name: string, time: string) {
        this._courseCode = courseCode
        this._days = this.parseDays(days)
        this._name = name
        this._timeStartnEnd = [moment(this.parseTime(time)[0], 'hh:mm A'), moment(this.parseTime(time)[1], 'hh:mm A')]
    }

    get courseCode(){
        return this._courseCode
    }

    get name() {
        return this._name
    }

    get days() {
        return this._days
    }

    get timeStartnEnd() {
        return this._timeStartnEnd
    }

    parseDays(days: string) {
        const buffer = days.split("")
        let daysArray: string[] = []

        for (let i = 0; i < buffer.length; i++) {

            if (buffer[i] === "T") {

                if (buffer[i + 1] === "u") {
                    daysArray = [...daysArray, "Tu"]
                } else {
                    daysArray = [...daysArray, "Th"]
                }
                i = i + 1 //skip the next letter
            } else {
                daysArray = [...daysArray, buffer[i]]
            }
        }

        return daysArray
    }

    parseTime(time: string) {
        const buffer = time.split("-")
        let timeStart = buffer[0]
        let timeEnd = buffer[1]
        let adjustedTimeSnE: string[] = []

        if (timeStart !== "TBA") {
            if (timeEnd.slice(-1) === "p") {
                timeStart = timeStart + "pm"
                timeEnd = timeEnd.slice(0, -1) + "pm"
            } else {
                timeStart = timeStart + "am"
                timeEnd = timeEnd.slice(0, -1) + "am"
            }

            adjustedTimeSnE = [...adjustedTimeSnE, timeStart, timeEnd]
        }else{
            adjustedTimeSnE = [...adjustedTimeSnE, "TBA", "TBA"]
        }
        return adjustedTimeSnE
    }

}