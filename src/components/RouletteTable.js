import React, { Component } from 'react';
import takeRight from 'lodash.takeright';
import uniq from 'lodash.uniq';
import chip from '../chip.svg';
import piece from '../piece.svg'

import { ToastContainer, toast } from 'react-toastify';
import '../../node_modules/react-toastify/dist/ReactToastify.css';


export default class RouletteTable extends Component {

    state = {
        rolling37: [],
        numbersTobet: [],
        message: '',
        active: false,
        bet: false,
        unit: null,
        allTime: [],
        balance: 0,
        winningNumber: null,
        stake: 0
    }

    addSeedNumber = (numberObj) => {
        this.setState({
            rolling37: this.state.rolling37.concat(numberObj).reduce((acc, n) => {
                const frequency = acc.filter(a => a.number === n.number).length;
                const status = frequency === 0 ? 'U' : `R${frequency}`;
                const obj = {
                    number: n.number,
                    status: status
                }
                acc.push(obj)
                return acc; 
            }, [])
        })
    }

    addExtraNumber = (numberObj) => {
        this.setState({
            rolling37: this.state.rolling37.concat(numberObj).slice(1).reduce((acc, n) => {
                const frequency = acc.filter(a => a.number === n.number).length;
                const status = frequency === 0 ? 'U' : `R${frequency}`;
                const obj = {
                    number: n.number,
                    status: status
                }
                acc.push(obj)
                return acc;
            }, [])
        }, () => {
            const { rolling37 } = this.state;
            const last5 = takeRight(rolling37, 5).reduce((acc, n) => {
                acc.push(n.status)
                return acc;
            }, []).join('');
            this.checkForBetTrigger(last5)
        })
    }

    allAllNumbers = (numberObj) => {
        this.setState({
            allTime: this.state.allTime.concat(numberObj).reduce((acc, n) => {
                const frequency = acc.filter(a => a.number === n.number).length;
                const status = frequency === 0 ? 'U' : `R${frequency}`;
                const obj = {
                    number: n.number,
                    status: status
                }
                acc.push(obj)
                return acc; 
            }, [])
        })
    }

    setTableChips = () => {
        this.setState({
            numbersTobet: uniq(this.state.rolling37.reduce((acc, n) => {
                if (n.status.includes('R') || n.status === 'U') acc.push(n.number)
                return acc;
            }, [])),
            message: 'Bet'
        }, () => {
            toast.success(<p>{this.state.message} {this.state.unit} units</p>)
            const { numbersTobet, unit } = this.state;
            this.setState({
                stake: unit * numbersTobet.length
            })

        })
    }

    checkForBetTrigger = (last5) => {
        console.log('called!!')
        console.log(last5)
        console.log('1', /(U|(R\d\d?)){3}U{2}/g.test(last5))
        console.log('2', /(U|(R\d\d?)){2}U{3}/g.test(last5))
        console.log('3', /(U|(R\d\d?)){3}U{2}/g.test(last5))
        console.log('4', /(U|(R\d\d?)){2}(R\d\d?){1}U{2}/g.test(last5))
        console.log('5', /(U|(R\d\d?)){1}(R\d\d?){1}U{3}/g.test(last5))
        const length = this.state.allTime.length;
        console.log(length)
        if (length === 38) { // If length  === 38 then this means it is the first number after initial 37 so doesn't matter about previous numbers
            if (/(U|(R\d\d?)){3}U{2}/g.test(last5)) {
                this.setState({
                    bet: true,
                    unit: 1,
                    
                }, this.setTableChips)
            }
        }
        else if (length === 39) { // if length is 39, this is 2 numbers after 37 so we can use U|R U|R U U U or U|R U|R U|R U U 
            if (/(U|(R\d\d?)){2}U{3}/g.test(last5)) {
                this.setState({
                    bet: true,
                    unit: 3
                }, this.setTableChips)
            } else if (/(U|(R\d\d?)){3}U{2}/g.test(last5)) {
                this.setState({
                    bet: true,
                    unit: 1
                }, this.setTableChips)
            }
        }
        else {
            if (/(U|(R\d\d?)){2}(R\d\d?){1}U{2}/g.test(last5)) {
                this.setState({
                    bet: true,
                    unit: 1
                }, this.setTableChips)
            } else if (/(U|(R\d\d?)){1}(R\d\d?){1}U{3}/g.test(last5)) {
                this.setState({
                    bet: true,
                    unit: 3
                }, this.setTableChips)
            } else {
                this.setState({
                    bet: false,
                    unit: null,
                    message: '',
                    numbersTobet: []
                })
            }
        }
    }
    
    addNumberToArray = (number) => {
        const { rolling37 } = this.state;
        const length = rolling37.length;
        const numberObj = {
            number: number,
            status: ''
        }
        this.setState({ 
            winningNumber: number,
            numbersTobet: [],
            stake: 0 
        })
        if (length > 36) this.addExtraNumber(numberObj);
        else this.addSeedNumber(numberObj)
        this.allAllNumbers(numberObj)
    }

    placeBet = () => {
        const n = () => Math.floor(Math.random() * Math.floor(37));
        const number = n();
        const { numbersTobet, stake, unit } = this.state;
        if (numbersTobet.includes(number)) {
            const diff = (0 - stake) + (unit * 36) 
            this.setState({
                balance: this.state.balance + diff
            }, () => {
                toast.success(`Result: ${number}! You won +(£${diff})`);
                this.addNumberToArray(number);
            })
        } else {
            const diff = 0 - stake;
            this.setState({ 
                balance: this.state.balance + diff,
            }, () => {
                toast.warn(`Result: ${number}! You lost -(£${diff})`);
                this.addNumberToArray(number);
            })
        }
    }
   
    render () {

        const column1 = [3, 6, 9, 12, 2, 5, 8, 11, 1, 4, 7, 10];
        const column2 = [15, 18, 21, 24, 14, 17, 20, 23, 13, 16, 19, 22];
        const column3 = [27, 30, 33, 36, 26, 29, 32, 35, 25, 28, 31, 34]
        const reds = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

        const { rolling37, numbersTobet, bet, winningNumber, stake, balance } = this.state;

        const boxStyle = {
            height: '75px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '0.1rem #FFF solid',
            position: 'relative'
        }
        const numberStyle = {
            textAlign: 'center',
            fontSize: '1.25rem',
            color: '#FFF',
            fontWeight: 'bold',
            textDecoration: 'none'
        }
        const smallNumberStyle = {
            textAlign: 'center',
            fontSize: '0.75rem',
            color: '#FFF',
            fontWeight: 'bold',
            textDecoration: 'none'
        }
        const smallBoxStyle = {
            height: '30px',
            width: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: 0,
            border: '0.075rem #FFF solid'
        }

        const columnStyle = {
            margin: 0
        }

        const disabled = bet ? false : true;

        return (
            <div className='hero is-dark is-bold'>
                <div className='content' >
                    <hr/>
                    <div className='columns'>
                        <div className='column is-8'>
                            <div className='columns is-centered is-gapless' style={columnStyle}>
                                <div className='column is-1 is-offset-1'>
                                    <a className='notification is-danger' style={{ 
                                            height: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            border: '0.1rem #FFF solid'
                                        }}  
                                       
                                        onClick={() => this.addNumberToArray(0)}>
                                        <p style={numberStyle}>0</p>
                                        {numbersTobet.includes(0) && <img src={chip} style={{ maxWidth: '30px', position: 'absolute', top: '30px', right: '10px' }} />}
                                        {0 === winningNumber && <img src={piece} style={{ maxWidth: '30px', position: 'absolute', top: '20px', right: '15px' }} />}
                                    </a>
                                </div>
                                <div className='column is-3'>
                                    <div className='columns is-mobile is-multiline is-gapless'>
                                        {column1.map((no, index) => {
                                            return <div className='column is-one-quarter' key={index}>
                                                <a className={`notification ${reds.includes(no) ? 'is-success' : 'is-black'}`} style={boxStyle} value={no} 
                                                onClick={() => this.addNumberToArray(no)}>
                                                    <p style={numberStyle}>{no}</p>
                                                    {numbersTobet.includes(no) && <img src={chip} style={{ maxWidth: '30px', position: 'absolute', top: '30px', right: '10px' }} />}
                                                    {no === winningNumber && <img src={piece} style={{ maxWidth: '30px', position: 'absolute', top: '20px', right: '15px' }} />}
                                                </a>
                                            </div>
                                        })}
                                    </div>
                                </div>
                                <div className='column is-3'>
                                    <div className='columns is-mobile is-multiline is-gapless'>
                                        {column2.map((no, index)=> {
                                            return <div className='column is-one-quarter' key={index}>
                                                <a className={`notification ${reds.includes(no) ? 'is-success' : 'is-black'}`} style={boxStyle} value={no} 
                                                onClick={() => this.addNumberToArray(no)}>
                                                    <p style={numberStyle}>{no}</p>
                                                    {numbersTobet.includes(no) && <img src={chip} style={{ maxWidth: '30px', position: 'absolute', top: '30px', right: '10px' }} />}
                                                    {no === winningNumber && <img src={piece} style={{ maxWidth: '30px', position: 'absolute', top: '30px', right: '10px' }} />}
                                                </a>
                                            </div>
                                        })}
                                    </div>
                                </div>
                                <div className='column is-3'>
                                    <div className='columns is-mobile is-multiline is-gapless'>
                                        {column3.map((no, index) => {
                                            return <div className='column is-one-quarter' key={index}>
                                                <a className={`notification ${reds.includes(no) ? 'is-success' : 'is-black'}`} style={boxStyle} value={no} 
                                                onClick={() => this.addNumberToArray(no)}>
                                                    <p style={numberStyle}>{no}</p>
                                                    {numbersTobet.includes(no) && <img src={chip} style={{ maxWidth: '30px', position: 'absolute', top: '30px', right: '10px' }} />}
                                                    {no === winningNumber && <img src={piece} style={{ maxWidth: '30px', position: 'absolute', top: '30px', right: '10px' }} />}
                                                </a>
                                            </div>
                                        })}
                                    </div>
                                </div>
                                <div className='column is-1'>
                                    <div className='columns is-mobile is-multiline is-gapless'>
                                        <div className='column is-12'>
                                            <a style={boxStyle}>
                                                <p style={numberStyle}>2to1</p>
                                            </a>
                                        </div>
                                        <div className='column is-12'>
                                            <a style={boxStyle}>
                                                <p style={numberStyle}>2to1</p>
                                            </a>
                                        </div>
                                        <div className='column is-12'>
                                            <a style={boxStyle}>
                                                <p style={numberStyle}>2to1</p>
                                            </a>
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                            <div className='columns is-mobile is-centered is-multiline is-gapless' style={columnStyle}>
                                <div className='column is-3'>
                                    <a style={boxStyle}>
                                        <p style={numberStyle}>1st 12</p>
                                    </a>
                                </div>
                                <div className='column is-3'>
                                    <a style={boxStyle}>
                                        <p style={numberStyle}>2nd 12</p>
                                    </a>
                                </div>
                                <div className='column is-3'>
                                    <a style={boxStyle}>
                                        <p style={numberStyle}>3rd 12</p>
                                    </a>
                                </div>
                            </div>
                            <div className='columns is-mobile is-centered is-multiline is-gapless'>
                                <div className='column is-3'>
                                    <div className='columns is-mobile is-multiline is-gapless'>
                                        <div className='column is-half'>
                                            <a style={boxStyle}>
                                                <p style={numberStyle}>1-18</p>
                                            </a>
                                        </div>
                                        <div className='column is-half'>
                                            <a style={boxStyle}>
                                                <p style={numberStyle}>Even</p>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div className='column is-3'>
                                    <div className='columns is-mobile is-multiline is-gapless'>
                                        <div className='column is-half'>
                                            <a className='notification is-success' style={boxStyle}>
                                                <p style={numberStyle}>RED</p>
                                            </a>
                                        </div>
                                        <div className='column is-half'>
                                            <a className='notification is-black' style={boxStyle}>
                                                <p style={numberStyle}>BLACK</p>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div className='column is-3'>
                                    <div className='columns is-mobile is-multiline is-gapless'>
                                        <div className='column is-half'>
                                            <a style={boxStyle}>
                                                <p style={numberStyle}>Odd</p>
                                            </a>
                                        </div>
                                        <div className='column is-half'>
                                            <a style={boxStyle}>
                                                <p style={numberStyle}>19-36</p>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='columns is-centered'>
                                <div className='column is-one-fifth'>
                                    <p>Stake: <strong style={{ color: '#FFF' }}>£{stake}</strong></p>
                                </div>
                                <div className='column is-two-fifths'>
                                    <button className='button is-large is-link' disabled={disabled} onClick={this.placeBet}>PLACE BET</button>
                                </div>
                            </div>
                        </div>
                        <div className='column is-3'>
                            <p style={numberStyle}>Count: {rolling37.length}</p>
                            <div className='columns is-multiline is-gapless'>
                                {rolling37.map((no, index) => 
                                    <div className='column is-narrow' key={index}>
                                        <div className={`notification ${reds.includes(no.number) ? 'is-success' : no.number === 0 ? 'is-danger' : 'is-black'}`} style={smallBoxStyle}>
                                            <p style={smallNumberStyle}>{no.number}</p>
                                        </div>
                                        <p style={smallNumberStyle}>{no.status}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <hr/>
                    <div className='columns'>
                        <div className='column is-offset-1'>
                            <h3 style={{ color: '#FFF' }}>Balance: £{balance}</h3>

                        </div>
                    </div>
                </div>
                <hr/>
                <ToastContainer position={'top-center'} autoClose={false}/>
            </div>
            
            
        )
    }
}