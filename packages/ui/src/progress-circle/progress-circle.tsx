// Tremor ProgressCircle [v0.0.3]

import React from "react"
import { tv, VariantProps } from "tailwind-variants"

import { cn } from "@repo/ui/lib/utils"

const progressCircleVariants = tv({
    slots: {
        background: "",
        circle: "",
    },
    variants: {
        variant: {
            default: {
                background: "stroke-java-200 dark:stroke-java-500/30",
                circle: "stroke-java-500 dark:stroke-java-500",
            },
            neutral: {
                background: "stroke-gray-200 dark:stroke-gray-500/40",
                circle: "stroke-gray-500 dark:stroke-gray-500",
            },
            blue: {
                background: "stroke-firefly-500 dark:stroke-firefly-500/40",
                circle: "stroke-firefly-500 dark:stroke-firefly-500",
            },
            warning: {
                background: "stroke-saffron-200 dark:stroke-saffron-500/30",
                circle: "stroke-saffron-500 dark:saffron-yellow-500",
            },
            error: {
                background: "stroke-red-200 dark:stroke-red-500/30",
                circle: "stroke-red-500 dark:stroke-red-500",
            },
            success: {
                background: "stroke-aquamarine-200 dark:stroke-aquamarine-500/30",
                circle: "stroke-aquamarine-500 dark:stroke-aquamarine-500",
            },
        },
    },
    defaultVariants: {
        variant: "default",
    },
})

interface ProgressCircleProps
    extends Omit<React.SVGProps<SVGSVGElement>, "value">,
    VariantProps<typeof progressCircleVariants> {
    value?: number
    max?: number
    showAnimation?: boolean
    radius?: number
    strokeWidth?: number
    children?: React.ReactNode
}

const ProgressCircle = React.forwardRef<SVGSVGElement, ProgressCircleProps>(
    (
        {
            value = 0,
            max = 100,
            radius = 32,
            strokeWidth = 6,
            showAnimation = true,
            variant,
            className,
            children,
            ...props
        }: ProgressCircleProps,
        forwardedRef,
    ) => {
        const safeValue = Math.min(max, Math.max(value, 0))
        const normalizedRadius = radius - strokeWidth / 2
        const circumference = normalizedRadius * 2 * Math.PI
        const offset = circumference - (safeValue / max) * circumference

        const { background, circle } = progressCircleVariants({ variant })
        return (
            <div
                className={cn("relative")}
                role="progressbar"
                aria-label="Progress circle"
                aria-valuenow={value}
                aria-valuemin={0}
                aria-valuemax={max}
                data-max={max}
                data-value={safeValue ?? null}
                tremor-id="tremor-raw"
            >
                <svg
                    ref={forwardedRef}
                    width={radius * 2}
                    height={radius * 2}
                    viewBox={`0 0 ${radius * 2} ${radius * 2}`}
                    className={cn("-rotate-90 transform", className)}
                    {...props}
                >
                    <circle
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        stroke=""
                        strokeLinecap="round"
                        className={cn("transition-colors ease-linear", background())}
                    />
                    {safeValue >= 0 ? (
                        <circle
                            r={normalizedRadius}
                            cx={radius}
                            cy={radius}
                            strokeWidth={strokeWidth}
                            strokeDasharray={`${circumference} ${circumference}`}
                            strokeDashoffset={offset}
                            fill="transparent"
                            stroke=""
                            strokeLinecap="round"
                            className={cn(
                                "transition-colors ease-linear",
                                circle(),
                                showAnimation &&
                                "transform-gpu transition-all duration-300 ease-in-out",
                            )}
                        />
                    ) : null}
                </svg>
                <div
                    className={cn("absolute inset-0 flex items-center justify-center")}
                >
                    {children}
                </div>
            </div>
        )
    },
)

ProgressCircle.displayName = "ProgressCircle"

export { ProgressCircle, type ProgressCircleProps }