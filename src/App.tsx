import React, { useCallback, useEffect, useState } from 'react';
import { Box, Grid, Typography } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

export interface ICategory {
    id: string;
    label: string;
    productsCount: number;
    parentId: null | string;
    children: ICategory[];
}

interface ICategoryListProps {
    subItems: ICategory[];
    toggleExpand: (id: string) => void;
    expand: (id: string) => boolean;
}
const CategoryList: React.FC<ICategoryListProps> = ({ subItems, toggleExpand, expand }) => {
    return (
        <>
            {subItems.map(category => (
                <Box key={category.id} style={{ margin: '5px 0 20px 20px' }} onClick={(e) => (e.stopPropagation(),toggleExpand(category.id))}>
                    <Box data-testid={category.id} style={{ display: 'flex', gap: 20 }}>
                        <Typography>
                            <strong>Id</strong>: {category.id}
                        </Typography>
                        <Typography>
                            <strong>Label</strong>: {category.label}
                        </Typography>
                        <Typography>
                            <strong>Products</strong>: {category.productsCount}
                        </Typography>
                        <Typography>
                            <strong>ParentId</strong>: {category.parentId}
                        </Typography>
                        {expand(category.id) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </Box>
                    {expand(category.id) ? (
                        <CategoryList toggleExpand={toggleExpand} expand={expand} subItems={category.children} />
                    ) : (
                        ''
                    )}
                </Box>
            ))}
        </>
    );
};
export const Fetcher = {
    async get(url: string): Promise<ICategory[]> {
        let result: ICategory[] = [];
        try {
            result = await fetch(url).then(r => r.json());
        } catch (e) {}
        return result;
    },
};
const Categories = () => {
    const [register, setRegister] = useState<Record<string, boolean>>({});
    const [data, setData] = useState<ICategory[]>([]);

    useEffect(() => {
        async function fetch() {
            const items = await Fetcher.get('http://localhost:3001/api/v1/categories');
            setData(items);
        }
        fetch();
    }, []);

    const toggleExpand = useCallback(
        (id: string) => {
            if (!(id in register)) {
                register[id] = false;
            } else register[id] = !register[id];
            setRegister({ ...register });
        },
        [register]
    );

    const expand = useCallback(
        (id: string) => {
            const value = register[id];
            if (value === undefined) return true;
            return !!value;
        },
        [register]
    );

    return <CategoryList subItems={data} expand={expand} toggleExpand={toggleExpand} />;
};

function App() {
    return (
        <Box style={{ paddingTop: 50 }}>
            <Grid container spacing={3}>
                <Grid item lg={2}></Grid>
                <Grid item lg={8} style={{ boxShadow: '0px 0px 38px -25px rgba(0,0,0,0.36)', height: '100vh' }}>
                    <Categories />
                </Grid>
                <Grid item lg={2}></Grid>
            </Grid>
        </Box>
    );
}
export default App;
