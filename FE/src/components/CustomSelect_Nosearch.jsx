import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

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

const CustomSelect_Nosearch = ({ options, selectedValue, handleChange, placeholder, width, isRequire = true }) => {

    return (
        <div>
            <FormControl sx={{
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
                    borderColor: "#005bbb", // Fixed border color
                    color: "#999999", // Màu mặc định
                    "&.Mui-focused": {
                        color: "#005bbb", // Khi focus đổi màu
                        borderColor: "#005bbb", // Maintain color on hover
                    }
                }
            }}>
                <InputLabel id="label">
                    {<>
                        <span>{placeholder} </span>
                        {isRequire &&
                            <span style={{ color: "#ff375f" }}>*</span>
                        }
                    </>}
                </InputLabel>
                <Select
                    labelId="label"
                    value={selectedValue}
                    onChange={handleChange}
                    input={
                        <OutlinedInput label=
                            {<>
                                <span>{placeholder}</span>
                                {isRequire &&
                                    <span>{' '} *</span>
                                }
                            </>}
                        />
                    }
                    MenuProps={MenuProps}
                    sx={{ textAlign: "left" }}
                >
                    {
                        options.map((option) => (
                            <MenuItem
                                key={option}
                                value={option}
                            >
                                {option}
                            </MenuItem>
                        ))
                    }

                </Select>
            </FormControl>
        </div>
    );
};

export default CustomSelect_Nosearch;
