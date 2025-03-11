import React, { useState } from "react";
import emptySearch from "../assets/emptySearch.png";

import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import ListSubheader from "@mui/material/ListSubheader";
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

const MenuProps = {
    PaperProps: {
        sx: {
            maxHeight: 300,
            overflowY: "auto",
            width: 260,
            "&::-webkit-scrollbar": {
                width: 6,
            },
            "&::-webkit-scrollbar-thumb": {
                background: "rgba(0, 91, 187, 0.5)",
                borderRadius: 6,
                transition: "background 0.3s ease",
                "&:hover": {
                    background: "rgba(0, 91, 187, 0.7)",
                },
            },
            "&::-webkit-scrollbar-track": {
                background: "#fff",
            },
        },
    },
};


const CustomSelect = ({ options, selectedValue, handleChange, placeholder, width }) => {
    const [searchText, setSearchText] = useState("");

    return (
        <div>
            <FormControl sx={{
                display: "flex",
                width: width,
                background: '#e8f0fe',
                "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                        borderColor: "#005bbb", // Màu viền cố định
                    },
                    "&:hover fieldset": {
                        borderColor: "#005bbb", // Khi hover vẫn giữ màu này
                    },
                    "&.Mui-focused fieldset": {
                        borderColor: "#005bbb", // Khi focus vẫn giữ màu này
                    },
                },
                "& .MuiInputLabel-root": {
                    color: "#999999", // Màu mặc định
                    "&.Mui-focused": {
                        color: "#005bbb", // Khi focus đổi màu
                    }
                }
            }}>
                <InputLabel id="label">
                    {<>
                        <span>{placeholder} </span>
                        <span style={{ color: "#ff375f" }}>*</span>
                    </>}
                </InputLabel>
                <Select
                    labelId="label"
                    value={selectedValue}
                    onChange={handleChange}
                    input={<OutlinedInput label=
                        {<>
                            <span>{placeholder} *</span>
                        </>}
                    />}
                    MenuProps={MenuProps}
                    sx={{ textAlign: "left" }}
                >

                    <ListSubheader>
                        <TextField
                            placeholder="Tìm kiếm"
                            fullWidth
                            variant="outlined"
                            size="small"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            autoFocus
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </ListSubheader>

                    {options.length > 0 ?
                        (
                            options.map((option) => (
                                <MenuItem key={option.code} value={option.code}>
                                    {option.name}
                                </MenuItem>
                            ))

                        ) : (
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: "100%",
                                    flexDirection: "column",
                                }}
                            >
                                <img
                                    src={emptySearch}
                                    alt="emptySearch"
                                    style={{
                                        width: "210px",
                                        height: "210px",
                                    }}
                                />
                                <span
                                    style={{
                                        fontSize: "13px",
                                        fontWeight: "bold",
                                        color: "#999999",
                                    }}
                                >
                                    Không tìm thấy kết quả phù hợp
                                </span>
                            </div>
                        )}

                </Select>
            </FormControl>
        </div>
    );
};

export default CustomSelect;
