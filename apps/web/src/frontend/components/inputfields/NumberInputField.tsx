import type React from "react";
import BaseInput from "./BaseInputField";
import "./NumberInputField.css"; // hide or style arrows
import { CaretDownIcon, CaretUpIcon } from "@phosphor-icons/react";

const NumberInputField: React.FC<React.ComponentProps<typeof BaseInput>> = (
	props
) => {
	const handleIncrease = () => {
		if (props.onChange && props.value !== undefined) {
			const newValue = Number(props.value) + 1;
			props.onChange({
				...({} as React.ChangeEvent<HTMLInputElement>),
				target: { value: newValue.toString() },
			} as React.ChangeEvent<HTMLInputElement>);
		}
	};
	const handleDecrease = () => {
		if (props.onChange && props.value !== undefined) {
			const newValue = Number(props.value) - 1;
			props.onChange({
				...({} as React.ChangeEvent<HTMLInputElement>),
				target: { value: newValue.toString() },
			} as React.ChangeEvent<HTMLInputElement>);
		}
	};
	return (
		<div className="relative">
			<BaseInput type="number" {...props} />
			<div className="absolute top-1/2 right-4 flex -translate-y-2/11 transform flex-col justify-between transition-colors duration-200">
				<button
					className="cursor-pointer hover:text-orange-500"
					onClick={handleIncrease}
					type="button"
				>
					<CaretUpIcon />
				</button>
				<button
					className="cursor-pointer hover:text-orange-500"
					onClick={handleDecrease}
					type="button"
				>
					<CaretDownIcon />
				</button>
			</div>
		</div>
	);
};

export default NumberInputField;
