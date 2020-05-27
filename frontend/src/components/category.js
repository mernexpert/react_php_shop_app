import React, { Component, useState, useEffect } from 'react';
import ScrollMenu from 'react-horizontal-scrolling-menu';
import axios from 'axios';

function Category({selectCategory}) {

    const [selected, setSelected] = useState('');
    const [categories, setCategories] = useState([]);

    const MenuItem = ({ text, selected }) => {
        return <div
            className={`menu-item ${selected ? 'active' : ''}`}
        >{text}</div>;
    };

    useEffect(() => {
        let get_category_url = process.env.REACT_APP_API_URL + 'controller/category.php';
        axios.get(get_category_url)
            .then(res => {
                console.log(res.data.results);
                setCategories(res.data.results);
                onSelect(res.data.results[0].id)
            })
    }, [])

    const Menu = (categories, selected) =>
        categories.map(el => {
            const { name, id } = el;
            return <MenuItem text={name} key={id} selected={selected} />;
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
        selectCategory(key);
    }

    return (
        <div className="App">
            <ScrollMenu
                data={Menu(categories, selected)}
                arrowLeft={ArrowLeft}
                arrowRight={ArrowRight}
                selected={selected}
                onSelect={onSelect}
            />
        </div>
    );
}

export default Category;