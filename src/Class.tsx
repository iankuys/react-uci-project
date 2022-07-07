import moment from "moment"

moment().format();

export default class Class{

    private _name:string
    private _days:string []
    private _timeStart:any
    private _timeEnd:any

    constructor(days:string[], name:string, timeS:string, timeE:string){
        this._days = days
        this._name = name
        this._timeStart = moment(timeS, 'hh:mm A')
        this._timeEnd = moment(timeE, 'hh:mm A')
    }

    get name(){
        return this._name
    }

    get days(){
        return this._days
    }

    get timeStart(){
        return this._timeStart
    }

    get timeEnd(){
        return this._timeEnd
    }

}