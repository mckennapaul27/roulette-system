import React, { Component } from 'react';
import takeRight from 'lodash.takeright';
import uniq from 'lodash.uniq';
import chip from '../chip.svg'
import { ToastContainer, toast } from 'react-toastify';
import '../../node_modules/react-toastify/dist/ReactToastify.css';


export default class RouletteTable extends Component {

    state = {
        rolling37: [],
        numbersTobet: [],
        message: '',
        active: false
    }
    
    addNumberToArray = (number) => {
        const { rolling37 } = this.state;
        const length = rolling37.length;
        const numberObj = {
            number: number,
            status: ''
        }
        
        if (length > 36) {
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
                const lastTwo = takeRight(rolling37, 2);
                if (lastTwo[0].status === 'U' && lastTwo[1].status === 'U') {
                    this.setState({
                        numbersTobet: this.state.rolling37.reduce((acc, n) => {
                            if (n.status.includes('R') || n.status === 'U') acc.push(n.number)
                            return acc;
                        }, []),
                        active: true
                    }, () => {
                        const uniqNumbers = uniq(this.state.numbersTobet);
                        this.setState({
                            message: 'Bet',
                            numbersTobet: uniqNumbers
                        }, () => {
                            toast.success(<p>{this.state.message}</p>)
                        })
                    })
                } else this.setState({
                    message: '',
                    numbersTobet: []
                })
            })
        } else {
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
    }

    // toggleActive = () => {
    //     this.setState({
    //         active: !this.state.active
    //     })
    // }

    render () {

        const column1 = [3, 6, 9, 12, 2, 5, 8, 11, 1, 4, 7, 10];
        const column2 = [15, 18, 21, 24, 14, 17, 20, 23, 13, 16, 19, 22];
        const column3 = [27, 30, 33, 36, 26, 29, 32, 35, 25, 28, 31, 34]
        const reds = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

        const { rolling37, numbersTobet, message, active } = this.state;

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

        // <div className='card-image' style={{ position: 'relative' }}>
        //     <figure className='image is-square'>
        //         <img src='' alt='BestPayBD Profile' />
        //     </figure>
        //     <img src='/images/stamp-white.png' style={{ maxWidth: '100px', position: 'absolute', top: '10px', right: '10px' }} />
        // </div>

        return (
            <div className='hero is-dark is-bold'>
                <div className='content'>
                    <hr/>
                    {/* <div className={`modal ${active ? 'is-active' : ''}`}>
                        <div className='modal-background'></div>
                        <div className='modal-content'>
                            <article className='message is-info'>
                                <div className='message-header'>Information</div>
                                <div className='message-body'>{message}</div>
                            </article>
                        </div>
                        <button className='modal-close is-large' onClick={this.toggleActive}></button>
                    </div> */}
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
                </div>
                <hr/>
                <ToastContainer position={'top-center'}/>
            </div>
            
            
        )
    }
}