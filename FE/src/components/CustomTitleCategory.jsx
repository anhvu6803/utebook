import React from "react";
import "./styles/CustomTitleCategory.scss"; // Import the SCSS file for styling
import CustomSelect_Category from "./CustomSelect_Category";
import { ChevronRight } from 'lucide-react'

const CustomTitleCategory = ({ 
    category = '', 
    categories, 
    selectedCategory, 
    handleCategoryChange,
    pageValue, 
}) => {
    return (
        <>
            {category === '' ?
                (
                    <>
                        <p className="title-category"> {pageValue.label} </p>
                        <CustomSelect_Category
                            options={categories}
                            selectedValue={selectedCategory}
                            handleChange={handleCategoryChange}
                            style={{ width: 150, height: 40 }}
                            size={'small'}
                        />
                    </>
                )
                :
                (
                    <>
                        <a
                            className="title-category active"
                            href={`/utebook/${pageValue.value}`}
                        >  {pageValue.label} <ChevronRight />
                        </a>
                        <CustomSelect_Category
                            options={categories}
                            selectedValue={category}
                            handleChange={handleCategoryChange}
                            style={{ width: 300, height: 50 }}
                            size={'large'}
                        />
                    </>
                )
            }

        </>
    );
}
export default CustomTitleCategory