import React from 'react';
import validate from 'validate.js';

const constraints = {
    "roomNumber": {
        presence: true,
        numericality: {
            onlyInteger: true,
            greaterThan: 0,
            lessThanOrEqualTo: 999
        }
    },
    "type": {
        presence: true,
        format: {
            pattern: "Single|Twin|Family|Suite",
            flags: "i",
            message: "can only contain the room options Single, Twin, Family, Suite"
        }        
    }, 
    "beds": {
        presence: true,
        numericality: {
            onlyInteger: true,
            greaterThan: 0,
            lessThanOrEqualTo: 10
        }
    },
    "accessible": {
        presence: true,
        format: {
            pattern: "true|false",
            flags: "i",
            message: "can only contain be true or false"
        }
    },
    "details": {
        presence: true,
        length: {
            maximum: 2000,
            minimum: 1
        },
        format: {
            pattern: "[ ,-A-Za-z0-9]+",
            flags: "i",
            message: "can only contain A-Z, a-z and 0-9"
        }        
    }
}

export default class RoomForm extends React.Component {

    constructor() {
        super();
		this.state = {
            errors : {},
            rooms : [], 
            newRoom : {
                roomNumber : 0,
                type : "",
                beds : 0,
                accessible : false,
                details : ""
            }
        };

        this.createRoom = this.createRoom.bind(this);
    }

    createRoom() {        
        let vErrors = validate(this.state.newRoom, constraints);

        if(vErrors != null){
            this.setState({errors : vErrors})
        } else {
            fetch('http://' + window.location.hostname + ':3001/room', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body : JSON.stringify(this.state.newRoom)
            })
            .then(res => {
                if(res.status == 200){
                    document.getElementById("roomNumber").value = '';
                    document.getElementById("type").value = '';
                    document.getElementById("beds").value = '';
                    document.getElementById("accessible").value = '';
                    document.getElementById("details").value = '';
                    
                    this.setState({
                        errors : {},
                        newRoom : {
                            roomNumber : 0,
                            type : "",
                            beds : 0,
                            accessible : false,
                            details : ""
                        }
                    })

                    this.props.updateRooms();
                }
            })
        }
    }
    
    render() {
        let errors = '';
        
        if(Object.keys(this.state.errors).length > 0){
            errors = <div className="alert alert-danger" style={{marginTop : 15 + "px"}}>
                    {Object.keys(this.state.errors).map((key, index) => {
                        return this.state.errors[key].map((value, index) => {
                            return <p key={index}>{value}</p>
                        })
                    })}
            </div>
        }

        return <div>
                    <div className="row">
                        <div className="col-sm-1"><input type="text" id="roomNumber" onChange={val => this.state.newRoom.roomNumber = val.target.value} /></div>
                        <div className="col-sm-2"><input type="text" id="type" onChange={val => this.state.newRoom.type = val.target.value} /></div>
                        <div className="col-sm-1"><input type="text" id="beds" onChange={val => this.state.newRoom.beds = val.target.value} /></div>
                        <div className="col-sm-1"><input type="text" id="accessible" onChange={val => this.state.newRoom.accessible = val.target.value} /></div>
                        <div className="col-sm-6"><input type="text" id="details" onChange={val => this.state.newRoom.details = val.target.value} /></div>
                        <div className="col-sm-1"><input type="button" value="Create" id="createRoom" onClick={this.createRoom}/></div>
                    </div>
                    {errors}
                </div>
    }

}