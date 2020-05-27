import React, { Component, useState, useEffect } from 'react';
import ScrollMenu from 'react-horizontal-scrolling-menu';
import axios from 'axios';

// list of items
const list = [
    { name: 'item1' },
    { name: 'item2' },
    { name: 'item3' },
    { name: 'item4' },
    { name: 'item5' },
    { name: 'item6' },
    { name: 'item7' },
    { name: 'item8' },
    { name: 'item9' }
];



function Category() {

    const [selected, setSelected] = useState('item1');

    const MenuItem = ({ text, selected }) => {
        return <div
            className={`menu-item ${selected ? 'active' : ''}`}
        >{text}</div>;
    };

    useEffect(()=> {
        let get_category_url = process.env.REACT_APP_API_URL+'controller/category.php';
        // axios.get(get_category_url, )
    },[])
    
    const Menu = (list, selected) =>
        list.map(el => {
            const { name } = el;
    
            return <MenuItem text={name} key={name} selected={selected} />;
        });
    
    
    const Arrow = ({ text, className }) => {
        return (
            <div
                className={className}
            >{text}</div>
        );
    };
    
    
    const ArrowLeft = Arrow({ text: '<', className: 'arrow-prev' });
    const ArrowRight = Arrow({ text: '>', className: 'arrow-next' });

    const onSelect = key => {
        setSelected(key);
    }

    const menu = Menu(list, selected)


    return (
        <div className="App">
            <ScrollMenu
                data={menu}
                arrowLeft={ArrowLeft}
                arrowRight={ArrowRight}
                selected={selected}
                onSelect={onSelect}
            />
        </div>
    );
}

export default Category;