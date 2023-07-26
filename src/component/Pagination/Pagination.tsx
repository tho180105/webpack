import {memo, useCallback} from "react";
import {FaArrowLeft, FaArrowRight} from "react-icons/fa";
import React from 'react'

const Pagination = ({handClickPage, activePage, numberOfPages}:{handClickPage:any,activePage:number,numberOfPages:number}) => {
    const reloadPage = (value:number) => {
        handClickPage(value)
    }
    const renderPage = useCallback((numberOfPages:number) => {
            let pagination = []
            let isEllipsisFrontShow = false;
            let isEllipsisLastShow = false;
            for (let number = 1; number <= numberOfPages; number++) {
                let isShow = false
                //Always
                if (number === 1 || number === numberOfPages) {
                    isShow = true;
                } else {
                    //front pages ( page 1 2)
                    if (activePage < 3) {
                        if (number <= 5) {
                            isShow = true;
                        }
                    }
                    //middle pages
                    else if (number > activePage - 3 && number < activePage + 3) {
                        isShow = true;
                    }
                    //last pages
                    else if (activePage > numberOfPages - 3) {
                        if (number > numberOfPages - 5) {
                            isShow = true
                        }
                    }
                }

                if (isShow) {
                    pagination.push(
                        <div className={activePage === number ? "item item-active" : "item"}
                             onClick={() => {
                                 reloadPage(number)
                             }}
                             key={number}
                        > {number}
                        </div>
                    )
                    continue;
                }

                //first ellipsis
                if (!isEllipsisFrontShow) {
                    if (number > activePage + 2 && number > 5 && !isShow) {
                        isEllipsisFrontShow = true;
                        pagination.push(
                            <div key={number} className={"item"}> ... </div>
                        )
                    }
                }

                //second ellipsis
                if (!isEllipsisLastShow) {
                    if (number < activePage - 2 && number < numberOfPages - 4 && !isShow) {
                        isEllipsisLastShow = true;
                        pagination.push(
                            <div key={number} className={"item"}> ... </div>
                        )
                    }
                }

            }

            return pagination
        },
        [activePage, numberOfPages])

    return (
        <>
            <div className={"pagination"}>

                <div className={(numberOfPages <= 1 ? "item hide " : "item ")+(activePage===1?'disable ':'')}
                     onClick={() => {
                         reloadPage(activePage > 1 ? activePage - 1 : 1)
                     }}><FaArrowLeft/>
                </div>

                {renderPage(numberOfPages)}

                <div className={(numberOfPages <= 1 ? "item hide " : "item ")+(activePage==numberOfPages?'disable ':'')}
                     onClick={() => {
                         reloadPage(activePage < numberOfPages ? activePage + 1 : numberOfPages)
                     }}><FaArrowRight/>
                </div>
            </div>
        </>
    )
}

export default memo(Pagination)
