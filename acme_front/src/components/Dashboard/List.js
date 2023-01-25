import React, {useRef, useMemo, useLayoutEffect, useEffect, useState} from "react";
import Form from "react-bootstrap/Form";
import classNames from "classnames";


export default function List({items}) {
    const isDetailedView = "grid";
    const [restaurantsList, setRestaurantsList] = useState([]);
    useEffect(() => {
        //console.log("city:");
        //console.log(city);

    }, [])
    // Ref to the container with elements
    const containerRef = useRef(null);



    return (
        <div>
            <div className="fixed-nav">
                <h3>Ci sono {items.length}</h3>
            </div>

            <div
                className={classNames("list", { "list-grid": isDetailedView })}
                ref={containerRef}
            >
                {items.map(item => (
                    //<div className="list-item" data-item="true" key={item.id}>
                      //  <h3>{item.name}</h3>
                       // {isDetailedView && (
                        //    <p className="list-item-description">{item.address}</p>
                       // )}
                    //</div>
                    <div className="card">
                    <div className="card-header">
                       {(item.closed === false)? (<div>Aperto</div>) : (<div>Chiuso</div>)}
                    </div>
                    <div className="card-body">
                    <h5 className="card-title">{item.name}</h5>
                    <p className="card-text">{item.address}</p>
                    <a href="#" className="btn btn-primary">Ordina</a>
                    </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
